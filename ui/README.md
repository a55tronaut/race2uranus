Race2Uranus UI

Constants and their usages are,

raceTotalDur : How long will the race take (in seconds) (int) <br />
countDownSeconds : How long the race countdown will take (in seconds) (int) <br />
raceLeftDur: How much is left for the ongoing race to over (in seconds) (int) <br />

isRaceStarted: True if the race is already started, if true race will end according to raceLeftDur if false race will end according to raceTotal Dur (boolean) <br />

totalRockets : Amount of total rockets that will race (int) <br />
finalStanding : Final standing of the rockets (array) <br />

maxHeight : Max height that a rocket can fly per turn (px) (int) <br />
minHeight : Min height that a rocket can fly per turn (px) (int) <br />

rocketsType : Rocket type asset that will be used (0/1/2/3) (array) <br />
assetType : Rocket asset type determined by rockets type (array) <br />
"monoRockets", <br />
"polyRockets", <br />
"monoSpaceShip", <br />
"polySpaceShip", <br />

timer : Timer function used in animation (string) <br />
path : path of rocket assets (string) <br />

randomResult : Results will be predefined or random (boolean) <br />
