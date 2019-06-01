var towerCommond = {

    run: function(spawnName, roomName) {
        var wallRatio;
        var rampartRatio;
        if (roomName == 'W23N29') {
            wallRatio = 0.01;
            rampartRatio = 0.1;
        } else if (roomName == 'W23N28') {
            wallRatio = 0.002;
            rampartRatio = 0.05;
        } else if (roomName == 'W22N28') {
            wallRatio = 0.0005;
            rampartRatio = 0.045;
        }

        const woundedCreep = Game.spawns[spawnName].room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.hits < creep.hitsMax
            }
        });

        const damagedDefense = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax*wallRatio) ||
                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax*rampartRatio);
            }
        });

        const damagedRoad = Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.75;
            }
        });

        Game.spawns[spawnName].room.find(FIND_STRUCTURES).forEach(function(struct) {
            if (struct.structureType === STRUCTURE_TOWER) {
                let closestHostile = struct.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                // attack the enemy
                if (closestHostile) {
                    struct.attack(closestHostile);
                // heal the wounded creep
                } else if (woundedCreep.length > 0) {
                    struct.heal(woundedCreep[0]);
                } else {
                    // repair the road
                    if (damagedRoad.length > 0) {
                        for (let i in damagedRoad) {
                            struct.repair(damagedRoad[i]);
                        }
                    } else {
                        // repair the gate and the wall when energy above 50%
                        if (struct.energy > struct.energyCapacity * 0.5) {
                            if (damagedDefense.length > 0) {
                                for (let j in damagedDefense) {
                                    struct.repair(damagedDefense[j]);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}

module.exports = towerCommond;
