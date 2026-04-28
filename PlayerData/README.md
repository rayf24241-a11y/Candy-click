# PlayerData

This folder holds exported player save files.

## How it works

When a player clicks **Generate Key** on the home screen, their full save data
is encoded into a portable key string. This key can be imported on any browser
using **Log In With Key**.

## Save file format

Player data is stored in the browser's localStorage using encrypted + checksummed
JSON. The AntiCheat system will detect and reject any manually modified saves.

## Files in this folder

| File | Description |
|------|-------------|
| `player_schema.json` | Template showing the structure of a player save |

## Fields

```json
{
  "user": {
    "name": "PlayerName",
    "created": 1714000000000
  },
  "save": {
    "candy": 0,
    "candyPerClick": 1,
    "candyPerSecond": 0,
    "totalCandy": 0,
    "buildings": [0, 0, 0, 0, 0, 0],
    "upgrades":  [false, false, false, false, false]
  }
}
```

## Buildings index

| Index | Building | CPS |
|-------|----------|-----|
| 0 | Trick-or-Treater | 0.1 |
| 1 | Candy Bowl | 1 |
| 2 | Candy Corn Farm | 8 |
| 3 | Chocolate Factory | 47 |
| 4 | Sugar Mine | 260 |
| 5 | Gummy Lab | 1,400 |
