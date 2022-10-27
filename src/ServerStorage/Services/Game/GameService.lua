local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local Promise = require(Knit.Util.Promise)
local Settings = require(ReplicatedStorage.src.Settings.Settings)

local GameService = Knit.CreateService({
	Name = "GameService",
	Client = {},
	isLobbyScene = false,
})

--[[
Key:
- Game points in each stage
-> Specifics of that point

:precious: GAME STAGES :precious:
Pre-game:
1.  - Loading screen (before the players are taken to the Waiting for Players screen)
       -> Animated screen for when the players join the game

2.  - Waiting for players screen
      -> When there are enough players in the game, there should be an animated clock in the top that appears counting down the amount of time until the game starts (will be 5/10 seconds)
      -> As explained in the doc, 4 players for non-competitive mode (doesn't have to be, we could just stick to competitive mode to reduce work. Non-competitive mode would be added one of the last added things to the game) Competitive mode would begin with 6 players in a game.

3.  - Explanation of the game
      -> Short slideshow slideshow animation of what the game is with a voice over it. RC has created the art in a document for this said presentation.

4. - Team choosing
      -> Randomize the players into teams that make sense. For example, if there are 6 players in the game playing we will have to program the game to make 3 teams of 2 instead of 2 teams of 3... Another example is 7 players, since it's uneven there would be 1 team of 3 and two teams of 2. We'll need some sort of smart system in order to recognize the amount of players there are in the game and make a correct # of teams. A leader of the team will be chosen, and two other players. The order of the players positions will depend on the segment they draw on. The leader for example will obviously get the first segment. Third team player would get third segment. Second would get second segment.
-> Last screen before the game that'll show on the screen for like 3 seconds, it'll show the players team, who the leader is and then the game will begin after. Additional note, the leader should be shown the prompt on THIS screen so when the game starts they don't have to completely rush it. They'll have these 4 seconds to prepare. So.. In order for this to happen prompt picking will have to be part of the pre-game stage as well.
Round 1
1.  - Nice looking drawing menu that is extremely user friendly. This is CRUCIAL.
       -> Mainly RC will be working on this but in terms of coding how the different tools would work (pencil, paint bucket and eraser, color changer) all need to be extremely easy and nice to use.

2.  - Round 1 Drawing
       -> 30 seconds are given to each player drawing. So.. In terms of drawing the entirety of the drawing process for the whole team should take roughly 90 seconds.

3.  - Spectating
       -> For the players who are not actively drawing should be able to see what their teammates have/what is already done on the drawing board. This gives the player time to think about how their going to draw their segment/just laugh at how dumb their drawing looks. On this screen should just show the entirety of the 3 segmented canvas, what has been done to it thus far of the round, and the players names under each segment.
Voting Process
1.  - Time's up screen!

2.  - Voting Process
       -> The players 3 segmented drawings will all be voted on! There will be 8 seconds between each drawing showing up on the screen at a time. The players that are voting will have the options between the following to vote with "Super Poop", "Poop", "Ok", "Good", "Awesome", "Legendary" depending on what the players vote, each of these will represent a number, distributing points depending on what the majority vote. Also, with this we will need a prevention system of people just spamming bad votes in order for a chance at their own drawing to win so maybe we could add some negative suttle effect for voting super poop a bunch of times. These points will remain with the players OF the team considering for round 2 teams will then again be randomized. The winner of the game will be a player in this case with this idea, not a team considering were randomizing. So... Player with most points of the ENTIRETY of the game, ROUNDS 1 AND 2 will be determined the winner of the ENTIRE game.
Round 2
1.  - Teams are randomized once again!

2.  - Repeat Round 1 Steps Said Above
Win Determining
1.  - Cool end screen animation
         -> The winner of the game is displayed along with the runner ups! Points will be displayed as well as their avatar, and username.

2.  - Repeat back to Pre-game screen, Waiting For Players
]]

local function isEnoughPlayers()
	return #Players:GetPlayers() >= Settings.LOBBY_PLAYERS_TO_START
end

--calls if players requiremnt is enough
local function enoughPlayersPromise()
	return Promise.fromEvent(Players.PlayerAdded, function(player)
		return isEnoughPlayers()
	end)
end

--calls if amount of players falls under not enough
local function notEnoughPlayersPromise()
	return Promise.fromEvent(Players.PlayerRemoving, function(player)
		return #Players:GetPlayers() < Settings.LOBBY_PLAYERS_TO_START
	end)
end

--[[LOBBY SCENE]]
function startLobbyScene()
	if isEnoughPlayers() then
		return BeginGameClock()
	end

	print("lobby")

	local lobbyScene = GameService.LobbyScene

	lobbyScene:ContactPlayers()

	--new players add to waiting for players
	Promise.fromEvent(Players.PlayerAdded, function(player)
		lobbyScene:ContactPlayer(player)
		return isEnoughPlayers()
	end):andThen(function()
		lobbyScene:Cleanup()
	end)

	return enoughPlayersPromise():andThenCall(print, "Got player requirement!"):andThenCall(BeginGameClock)
end

-- [[INTERMISSION SCENE]]
--[[
    Race condition:
        if the countdown finishes (10 seconds) then start explanation
        ELSE if players leave and the players amount falls under requiremnt then call lobby scene again
]]
function startIntermissionScene()
	print("intermission")

	return Promise.race({
		Promise.new(function(resolve, reject, onCancel)
			local cancel = false
			onCancel(function()
				cancel = true
			end)
			for i = 10, 0, -1 do
				if cancel then
					break
				end
				local s = string.format(Settings.TEXT.GAME_STARTING, tostring(i))
				print(s)
				for _, plr in Players:GetPlayers() do
					if plr.PlayerGui and plr.PlayerGui:FindFirstChild("Lobby") then
						plr.PlayerGui.Lobby.Countdown.Text = s
					end
				end
				task.wait(1)
			end

			resolve(true)
		end):andThenReturn(startExplanationScene),

		notEnoughPlayersPromise():andThenReturn(startLobbyScene),
	}):andThen(function(raceWinner)
		return raceWinner() -- returning explanation scene or lobby (waiting for players)
	end)
end

-- [[EXPLANATION SCENE]]
function startExplanationScene()
	print("explain")
	GameService.LobbyScene:Cleanup()

	return Promise.delay(1)
		:andThen(function()
			print("explain 1")
		end)
		:andThenCall(Promise.delay, 1)
		:andThen(function()
			print("explain 2")
		end)
		:andThenCall(startTeamScene)
end

-- [[DISPLAY TEAM MEMBERS SCENE (AND CHOOSING)]]
local function _randomizeTeams()
	local players = Players:GetPlayers()

	local teams = {} --[[ 
        ["TEAM_1"] = {
            player1,
            player2
        }    
    --]]

	local teamIndex = 1
	for i = 2, #players, 2 do --players: 2, 4, 6, 8, .., .., ..
		teams["TEAM_" .. teamIndex] = {
			players[i], --leader
			players[i - 1], --member
		}
		if #players % 2 ~= 0 then --last iteration
			if i - 1 == #players then
				table.insert(teams["TEAM_" .. teamIndex], players[#players])
			end
		end
	end

	return teams
end

function startTeamScene()
	local players = Players:GetPlayers()

	
	local randomTeams = _randomizeTeams()
	print(randomTeams)

	for team, plrs in randomTeams do
		for _, plr in plrs do
			GameService.TeamSceneService:ContactPlayer(plr, plrs)
		end
	end

	return Promise.delay(5):andThenCall(testDrawScene, randomTeams)
end

function testDrawScene(teams: table)
	local DrawSceneService = GameService.DrawSceneService

	local function playerDraw(player)
		return Promise.try(function()
			DrawSceneService:StartDrawing(player)
		end)
			:andThenCall(Promise.delay, 8)
			:andThen(function()
				print("finished drawing!")
			end)
	end
end

local currentGameClock = nil

function BeginGameClock()
	if isEnoughPlayers() then
		-- startIntermissionScene():awaitStatus()
		if currentGameClock ~= nil then
			currentGameClock:cancel()
		end

		currentGameClock = startIntermissionScene():andThen(function()
			warn("game ended!")
			warn("starting new game!")
		end) --:finallyCall(BeginGameClock)

		return game
	else
		--waiting for players
		return startLobbyScene()
	end
end

function GameService:KnitStart()
	task.wait(5)
	BeginGameClock()
end

function GameService:KnitInit()
	local LobbyScene = Knit.GetService("LobbySceneService")
	self.LobbyScene = LobbyScene

	local IntermissionScene = Knit.GetService("IntermissionService")
	self.IntermissionScene = IntermissionScene

	local DrawSceneService = Knit.GetService("DrawSceneService")
	self.DrawSceneService = DrawSceneService

	local TeamSceneService = Knit.GetService("TeamSceneService")
	self.TeamSceneService = TeamSceneService
end

return GameService
