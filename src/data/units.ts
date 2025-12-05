import type { UnitDefinition } from '../types/game';

export const UNIT_POOL: UnitDefinition[] = [
  {
    id: 'ahri',
    name: 'Ahri',
    cost: 4,
    traits: ['Star Guardian', 'Invoker'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Ahri.png',
    ability: 'Spirit Bomb',
    role: 'Carry',
    description:
      'Fires an orb that explodes on impact, dealing massive magic damage.'
  },
  {
    id: 'garen',
    name: 'Garen',
    cost: 1,
    traits: ['Warden', 'Fated'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Garen.png',
    ability: 'Courage',
    role: 'Frontline',
    description:
      'Spins to win, gaining damage reduction and taunting nearby enemies.'
  },
  {
    id: 'sett',
    name: 'Sett',
    cost: 2,
    traits: ['Bruiser', 'Fated'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Sett.png',
    ability: 'Haymaker',
    role: 'Frontline',
    description:
      'Stores damage taken and unleashes it in a cone of true damage.'
  },
  {
    id: 'lux',
    name: 'Lux',
    cost: 2,
    traits: ['Star Guardian', 'Arcanist'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Lux.png',
    ability: 'Final Spark',
    role: 'Carry',
    description: 'Channels a beam of pure light that melts enemies in a line.'
  },
  {
    id: 'lee-sin',
    name: 'Lee Sin',
    cost: 3,
    traits: ['Invoker', 'Dryad'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/LeeSin.png',
    ability: 'Dragon Rage',
    role: 'Carry',
    description: 'Kicks the target, knocking them into the entire board.'
  },
  {
    id: 'jinx',
    name: 'Jinx',
    cost: 3,
    traits: ['Hextech', 'Trickshot'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Jinx.png',
    ability: 'Fishbones Barrage',
    role: 'Carry',
    description:
      'Launches rockets that explode twice thanks to Trickshot ricochets.'
  },
  {
    id: 'shen',
    name: 'Shen',
    cost: 4,
    traits: ['Warden', 'Hextech'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Shen.png',
    ability: 'Stand United',
    role: 'Frontline',
    description:
      'Shields allies and teleports to intercept the most dangerous threat.'
  },
  {
    id: 'xayah',
    name: 'Xayah',
    cost: 5,
    traits: ['Umbral', 'Trickshot'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Xayah.png',
    ability: 'Featherstorm',
    role: 'Carry',
    description:
      'Leaps into the air, becoming untargetable and launching piercing feathers.'
  },
  {
    id: 'ornn',
    name: 'Ornn',
    cost: 5,
    traits: ['Dragonlord', 'Warden'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Ornn.png',
    ability: 'Call of the Forge God',
    role: 'Frontline',
    description:
      'Summons a massive elemental that knocks up and burns the frontline.'
  },
  {
    id: 'neeko',
    name: 'Neeko',
    cost: 4,
    traits: ['Star Guardian', 'Dryad'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Neeko.png',
    ability: 'Bloom Burst',
    role: 'Support',
    description:
      'Copies her strongest ally and shares their power for a short duration.'
  },
  {
    id: 'aatrox',
    name: 'Aatrox',
    cost: 3,
    traits: ['Umbral', 'Bruiser'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Aatrox.png',
    ability: 'World Ender',
    role: 'Frontline',
    description: 'Dives into the enemy backline and heals from every strike.'
  },
  {
    id: 'zoe',
    name: 'Zoe',
    cost: 1,
    traits: ['Star Guardian', 'Trickshot'],
    icon:
      'https://raw.githubusercontent.com/riot-api/dragontail-api/master/img/champion/Zoe.png',
    ability: 'Prank Portal',
    role: 'Support',
    description:
      'Summons a random portal that polymorphs or stuns the enemy for fun.'
  }
];


