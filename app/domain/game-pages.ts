import { GAME_CATALOG, type GameKey } from "./game-catalog";
import { absoluteUrl } from "./site";

export interface HowToStep {
  name: string;
  text: string;
}

export interface GamePageCopy {
  id: GameKey;
  playersLabel: string;
  playerCount: { minValue: number; maxValue: number } | null;
  landingTitle: string;
  landingDescription: string;
  landingH1: string;
  howToTitle: string;
  howToDescription: string;
  howToH1: string;
  ogImagePath: string;
  summary: string;
  paragraphs: string[];
  highlights: { title: string; body: string }[];
  steps: HowToStep[];
  scoring: { title: string; body: string }[];
  notes: string[];
}

const PAGES: Record<GameKey, GamePageCopy> = {
  "skull-king": {
    id: "skull-king",
    playersLabel: "2–8 players",
    playerCount: { minValue: 2, maxValue: 8 },
    landingTitle: "Play Skull King Online with Friends | Tabledeck",
    landingDescription:
      "Play Skull King online with friends for free. Bid your tricks, share a link, and play the pirate trick-taking card game in the browser. No download.",
    landingH1: "Play Skull King online with friends",
    howToTitle: "How to Play Skull King Online | Tabledeck",
    howToDescription:
      "Skull King rules for the Tabledeck table: ten rounds, trick bids, pirates, mermaids, and the Skull King. Open a free game and share the link.",
    howToH1: "How to play Skull King",
    ogImagePath: "/og/skull-king.png",
    summary:
      "Skull King on Tabledeck is a real-time trick-taking card game for two to eight players. Bid the tricks you will win, play a 70-card pirate deck, and settle the score after ten rounds.",
    paragraphs: [
      "Open a Skull King table, send the link, and play in the browser. Friends take a seat as guests or with a Tabledeck account. Nothing to install.",
      "Each round deals one more card than the last. Round 1 is a single card. Round 10 deals ten. Before anyone plays, every player bids how many tricks they will take. A bid of zero is a promise to take none.",
      "The deck has 70 cards: four suits of 1–14 (parrots, maps, treasure chests, and jolly rogers), five escapes, five pirates, the Tigress, two mermaids, and the Skull King. Jolly rogers are trump. The Tigress is played as either a pirate or an escape.",
      "This is Tabledeck's free online table for the pirate trick-taking game. It is a fan-made way to play together, not an official edition of the boxed game.",
    ],
    highlights: [
      {
        title: "A table for the group chat",
        body: "Create a game for 2–8 players and share one link. Seats fill as people join, and the same browser tab reconnects you to your seat.",
      },
      {
        title: "Bids, then cards",
        body: "You score for calling your tricks correctly. Taking more or fewer than you bid costs points, so the bid is the whole game.",
      },
      {
        title: "Ten rounds, then a winner",
        body: "The deal grows from one card to ten. Highest score after round 10 wins.",
      },
    ],
    steps: [
      {
        name: "Open a table",
        text: "Start a Skull King game on Tabledeck and choose how many seats you need, from 2 to 8.",
      },
      {
        name: "Share the link",
        text: "Send the game link to your friends. They join in the browser, pick a seat, and play as a guest or with a Tabledeck account.",
      },
      {
        name: "Deal the round",
        text: "Round 1 deals one card to each player. Each later round deals one more card, through ten cards in round 10.",
      },
      {
        name: "Bid your tricks",
        text: "Before cards are played, each player bids how many tricks they will win. Zero means you are trying to win no tricks at all.",
      },
      {
        name: "Play the trick",
        text: "Play one card in turn. A mermaid captures the Skull King. The Skull King captures pirates. Pirates beat mermaids and numbered cards, and the first pirate in the trick wins if several are played. With only numbered cards, the highest jolly roger wins; otherwise the highest card of the lead suit wins. If every card is an escape, the first escape wins.",
      },
      {
        name: "Score the round",
        text: "An exact bid of one or more tricks scores 20 points per trick. A successful zero bid scores 10 points times the round number. Missing a positive bid costs 10 points for each trick you are off. A failed zero bid costs 10 points times the round number.",
      },
      {
        name: "Add capture bonuses",
        text: "The player who wins the trick can earn a bonus: 10 points for winning with a 14 that is not a jolly roger, 20 for the jolly roger 14, 20 for each mermaid a pirate captures, 30 for each pirate the Skull King captures, and 40 when a mermaid captures the Skull King.",
      },
      {
        name: "Finish ten rounds",
        text: "After round 10 the highest score wins.",
      },
    ],
    scoring: [
      {
        title: "Exact bid",
        body: "20 points for each trick you bid, when you take exactly that many.",
      },
      {
        title: "Zero bid",
        body: "10 points times the round number if you take no tricks. The same amount is subtracted if you bid zero and take any trick.",
      },
      {
        title: "Missed bid",
        body: "Lose 10 points for every trick above or below a bid of one or more.",
      },
    ],
    notes: [
      "You can play a hand digitally, or use scorekeeper mode when the cards are on the physical table and you only need the bids and the score.",
      "Special pirate powers are part of the deck. Read the card when you play it; the trick order above is the rule that decides who takes the hand.",
    ],
  },
  "kings-cribbage": {
    id: "kings-cribbage",
    playersLabel: "2–4 players",
    playerCount: { minValue: 2, maxValue: 4 },
    landingTitle: "Play King's Cribbage Online with Friends | Tabledeck",
    landingDescription:
      "Play King's Cribbage online with friends. Place tiles, score fifteens, pairs, and runs, and race to 100. Free in the browser — share a link.",
    landingH1: "Play King's Cribbage online with friends",
    howToTitle: "How to Play King's Cribbage | Tabledeck",
    howToDescription:
      "King's Cribbage rules on Tabledeck: a shared tile board scored like cribbage. Fifteens, pairs, runs, and a race to 100 points.",
    howToH1: "How to play King's Cribbage",
    ogImagePath: "/og/kings-cribbage.png",
    summary:
      "King's Cribbage is a tile game for two to four players. You place ranks on a shared board and score the lines the way a cribbage hand scores: fifteens, pairs, and runs.",
    paragraphs: [
      "King's Cribbage puts cribbage counting onto a board. Everyone draws from one bag of 104 tiles — ace through king, in light and dark, four of each — and plays onto a 13 by 13 grid with the corners cut away.",
      "On your turn you place up to five tiles from a rack of five. A line cannot grow past five tiles. The opening play must cover the center and use at least two tiles. Later plays have to connect to tiles already on the board, and the placement has to score.",
      "A six may be flipped and played as a nine. Face cards count ten toward a fifteen. Aces count one. The first player to reach 100 points wins.",
      "Start a table for two, three, or four, share the link, and play in the browser. A Tabledeck account is optional.",
    ],
    highlights: [
      {
        title: "Cribbage, played as a board",
        body: "Fifteens, pairs, and runs are scored on the rows and columns you touch, not in a private hand.",
      },
      {
        title: "A short race",
        body: "Reach 100 points on your own scoring play and the game ends immediately.",
      },
      {
        title: "Two to four at the table",
        body: "Pick the seat count when you create the game, then send one link.",
      },
    ],
    steps: [
      {
        name: "Open a table",
        text: "Create a King's Cribbage game for 2, 3, or 4 players and share the link.",
      },
      {
        name: "Draw a rack",
        text: "Each player draws until they hold five tiles. The bag starts with 104 tiles: thirteen ranks, two colors, four copies of each.",
      },
      {
        name: "Open on the center",
        text: "The first play must include the center square and must place at least two tiles.",
      },
      {
        name: "Place a scoring line",
        text: "On your turn, place one to five tiles so they form a contiguous row or column of at most five tiles and connect to the board. The placement has to make a cribbage score. You may flip a 6 and play it as a 9.",
      },
      {
        name: "Count the line",
        text: "Score every fifteen for 2 points, every pair for 2 points, and every run of three or more for 1 point per card in the run, counting duplicate ranks in the run. Cross lines made by the same play are scored too.",
      },
      {
        name: "Take the bonuses",
        text: "The first play of the game scores 10 extra points. Using all five tiles in one turn scores 10. Playing all five in the same color (a flush) scores 10.",
      },
      {
        name: "Refill and continue",
        text: "Draw back to five tiles. If you cannot play, pass. If you have no useful tiles you may exchange some back into the bag when the rules of the turn allow it.",
      },
      {
        name: "End the game",
        text: "The game ends as soon as a scoring play reaches 100. It also ends if a player empties their rack while the bag is empty, or if every player passes in a row. In those last two cases, tiles left in hand are subtracted from the other scores, and the highest score wins.",
      },
    ],
    scoring: [
      {
        title: "Fifteen",
        body: "Any subset of a scored line that adds to 15 is worth 2 points. Aces are 1. Number tiles are their pips, with a flipped 6 counting as 9. Jacks, queens, and kings are 10.",
      },
      {
        title: "Pair",
        body: "Each pair of the same rank in the line is worth 2 points. Three of a kind is three pairs (6 points). Four of a kind is six pairs (12 points).",
      },
      {
        title: "Run",
        body: "A straight of three or more ranks scores 1 point per tile in the straight. Extra copies of a rank multiply the run.",
      },
      {
        title: "Bonuses",
        body: "10 points for the opening play, 10 for placing all five tiles, and 10 when those five tiles are the same color.",
      },
    ],
    notes: [
      "Lines are capped at five tiles, including tiles that were already on the board.",
      "You do not need the physical tiles. The board, the bag, and the score are all in the game.",
    ],
  },
  battleship: {
    id: "battleship",
    playersLabel: "2 players",
    playerCount: { minValue: 2, maxValue: 2 },
    landingTitle: "Play Battleship Online with a Friend | Tabledeck",
    landingDescription:
      "Play Battleship online with a friend for free. Hide your fleet on a 10×10 grid, trade shots, and sink every ship. No download — share a link.",
    landingH1: "Play Battleship online with a friend",
    howToTitle: "How to Play Battleship Online | Tabledeck",
    howToDescription:
      "Battleship rules on Tabledeck: place five ships on a 10×10 grid, call your shots, and sink the other fleet. Free for two players.",
    howToH1: "How to play Battleship",
    ogImagePath: "/og/battleship.png",
    summary:
      "Battleship on Tabledeck is a two-player game of hidden fleets. Place five ships, take turns calling squares, and sink every opposing ship to win.",
    paragraphs: [
      "This is the classic guessing game, played on a private 10 by 10 grid. Your opponent never sees where you placed your ships. They only see hits, misses, and ships that have already gone under.",
      "Each fleet is a carrier (5), a battleship (4), a cruiser (3), a submarine (3), and a destroyer (2). Ships sit in a straight horizontal or vertical line and do not overlap.",
      "Create a table, share the link, and place your fleet. Then call one square per turn. First player to sink the entire other fleet wins.",
    ],
    highlights: [
      {
        title: "Two players, one link",
        body: "Send a single URL. Your friend joins the other seat in the browser.",
      },
      {
        title: "Hidden fleets",
        body: "Ship positions stay on your side of the table until a ship is fully sunk.",
      },
      {
        title: "A standard fleet",
        body: "Five ships, from the two-square destroyer up to the five-square carrier.",
      },
    ],
    steps: [
      {
        name: "Start a two-player game",
        text: "Open Battleship on Tabledeck and share the link with one friend. A Tabledeck account is optional.",
      },
      {
        name: "Place your fleet",
        text: "Put all five ships on your 10×10 grid: carrier 5, battleship 4, cruiser 3, submarine 3, destroyer 2. Each ship is a straight line, horizontal or vertical, and ships cannot overlap.",
      },
      {
        name: "Confirm and wait",
        text: "When both fleets are locked in, the shooting starts. You cannot move a ship after placement.",
      },
      {
        name: "Call a square",
        text: "On your turn, choose one square on the attack grid. A hit marks part of a ship. A miss is recorded so you do not call it again.",
      },
      {
        name: "Sink a ship",
        text: "A ship sinks when every one of its squares has been hit. The sunk ship is then revealed.",
      },
      {
        name: "Take the fleet",
        text: "The player who sinks all five opposing ships wins.",
      },
    ],
    scoring: [
      {
        title: "Hit or miss",
        body: "There is no point total. The only score is ships remaining.",
      },
      {
        title: "Win",
        body: "Sink the carrier, battleship, cruiser, submarine, and destroyer.",
      },
    ],
    notes: [
      "The board is 10 by 10, lettered and numbered the way a paper pad is, so calls are a single square each turn.",
      "Salvos are one shot at a time, even after a hit.",
    ],
  },
  "game-of-things": {
    id: "game-of-things",
    playersLabel: "A host and the table",
    playerCount: null,
    landingTitle: "Play The Game of Things Online with Friends | Tabledeck",
    landingDescription:
      "Run The Game of Things with friends on a shared Tabledeck board. Set the prompt, track who is in, keep round notes, and share one live link.",
    landingH1: "Play The Game of Things with friends",
    howToTitle: "How to Play The Game of Things on Tabledeck",
    howToDescription:
      "Use Tabledeck to host The Game of Things: a live prompt, an in-or-out player list, and shared notes for answers and guesses. Free, no account for guests.",
    howToH1: "How to host The Game of Things",
    ogImagePath: "/og/game-of-things.png",
    summary:
      "Tabledeck's Game of Things is a live host board for the party game. The host sets the prompt, tracks who is in the round, and keeps notes while everyone with the link watches.",
    paragraphs: [
      "The Game of Things is a party game of outrageous answers: someone reads a prompt, everyone writes a response, and the table tries to guess who said what. Tabledeck hosts that round on one shared screen.",
      "The host creates the game, names themselves, and can set the prompt immediately or fill it in once people are looking. The link is the whole invite. Guests do not sign in and do not get the host controls.",
      "From the host seat you add players, mark someone out of a round, and type the notes for that round — the answers you are reading and the guesses the table makes. Everyone with the link sees the prompt, the list, and the notes update as you go.",
      "It is a table for running the game together, not a second copy of the printed deck. Bring your own prompts, or type the one you are playing.",
    ],
    highlights: [
      {
        title: "One link for the room",
        body: "Viewers follow along on their phones. Only the host, in the browser that created the game, can change the board.",
      },
      {
        title: "In and out",
        body: "Mark who is playing this prompt and who is sitting out, without rebuilding the list.",
      },
      {
        title: "Notes that stay with the round",
        body: "Keep the answers and the guesses in one place instead of a napkin.",
      },
    ],
    steps: [
      {
        name: "Create the board",
        text: "On things.tabledeck.us, enter your name as host. Add a prompt if you already know it. You can leave the prompt blank and set it after the link is open.",
      },
      {
        name: "Share the link",
        text: "Send the game link to the people at the table. Anyone who opens it sees the board. They do not need a Tabledeck account.",
      },
      {
        name: "Add the players",
        text: "The host adds each person to the list. Mark a player out when they are not answering this prompt, and back in when they are.",
      },
      {
        name: "Play the prompt",
        text: "Read the prompt aloud. Collect answers the way you normally play The Game of Things, then use the notes on the board to track what was said and who the table guesses.",
      },
      {
        name: "Move to the next thing",
        text: "Change the prompt, reset who is in, and clear or replace the notes for the next round. The same link stays open.",
      },
    ],
    scoring: [
      {
        title: "Scores live with the host",
        body: "The board can track a score next to each name. How you award points is the house rule you are already playing — Tabledeck does not invent a second scoring system.",
      },
    ],
    notes: [
      "Guests can see the prompt, the player list, and the notes. They cannot edit them. Host controls stay in the browser that created the game.",
      "Answers are not collected in secret by the app. Write them down or read them out, then record what the table needs on the shared board.",
    ],
  },
  scoreboard: {
    id: "scoreboard",
    playersLabel: "Any number of players",
    playerCount: null,
    landingTitle: "Free Online Scoreboard for Game Night | Tabledeck",
    landingDescription:
      "Keep a free live scoreboard for hearts, golf, nertz, or any round-based game. Share a link so the whole table can follow the score.",
    landingH1: "A live scoreboard for any game night",
    howToTitle: "How to Use the Tabledeck Scoreboard",
    howToDescription:
      "Start a shared scoreboard, add players, choose high score or low score, and enter each round. Everyone with the link sees the totals.",
    howToH1: "How to keep score on Tabledeck",
    ogImagePath: "/og/scoreboard.png",
    summary:
      "Scoreboard is a shared tally for games that are played in rounds. Name the game, add the players, enter each round, and let the totals add themselves.",
    paragraphs: [
      "Hearts, golf, nertz, Mexican train, a homemade card game — if you write down a number every round, Scoreboard is the pad. Create a board, share the link, and everyone follows the same totals.",
      "Choose whether a lower score wins or a higher score wins before you start. That choice only affects how the leader is shown. The math is a running sum of the rounds you enter.",
      "No account is required to open a board or to watch one. Finish the board when the game is over and the end time is saved with it.",
    ],
    highlights: [
      {
        title: "Any round-based game",
        body: "The board does not enforce house rules. It adds the numbers you type.",
      },
      {
        title: "High score or low score",
        body: "Turn on lower-is-better for golf-style games. Leave it off when more points win.",
      },
      {
        title: "One link, live totals",
        body: "Pass the URL down the table. Phones stay in step when a round is entered.",
      },
    ],
    steps: [
      {
        name: "Name the game",
        text: "Create a scoreboard and give it the name of whatever you are playing.",
      },
      {
        name: "Add players",
        text: "Enter a name for each seat. The board is built around that list, so add everyone before the first round if you can.",
      },
      {
        name: "Choose the direction",
        text: "Set lower-is-better when the smallest total should lead. Leave it off when the highest total leads.",
      },
      {
        name: "Share the link",
        text: "Send the board URL to the table. Viewers see rounds and totals update. No sign-in.",
      },
      {
        name: "Enter the round",
        text: "Type each player's score for that round. The total for each seat is the sum of their rounds.",
      },
      {
        name: "Finish",
        text: "Mark the board finished when you stop playing. The finish time is stored with the game.",
      },
    ],
    scoring: [
      {
        title: "Running total",
        body: "Each round is a number per player. Totals are the sum of those numbers. Tabledeck does not drop a highest round or apply a handicap unless you type the adjusted number yourself.",
      },
      {
        title: "Who is ahead",
        body: "The leader is the highest total, or the lowest total if you chose lower-is-better.",
      },
    ],
    notes: [
      "Use it beside a physical game. Scoreboard does not deal cards or enforce rules for hearts, golf, or anything else.",
      "If you need to correct a round, edit it on the board. The total follows the numbers that are saved.",
    ],
  },
};

export const GAME_PAGES = PAGES;

export function getGamePage(gameKey: GameKey): GamePageCopy {
  return PAGES[gameKey];
}

export function gameLandingPath(gameKey: GameKey): string {
  return `/games/${gameKey}`;
}

export function gameHowToPath(gameKey: GameKey): string {
  return `/games/${gameKey}/how-to-play`;
}

export function gamePlayUrl(gameKey: GameKey): string {
  return GAME_CATALOG[gameKey].href;
}

export function gameLandingUrl(gameKey: GameKey): string {
  return absoluteUrl(gameLandingPath(gameKey));
}

export function gameHowToUrl(gameKey: GameKey): string {
  return absoluteUrl(gameHowToPath(gameKey));
}
