var roleRepairer = {

    run: function(creep) {
        var wallRatio;
        var rampartRatio;
        if (creep.room.name == 'W23N29') {
            wallRatio = 0.02;
            rampartRatio = 0.1;
        } else if (creep.room.name == 'W23N28') {
            wallRatio = 0.005;
            rampartRatio = 0.05;
        } else if (creep.room.name == 'W22N28') {
            wallRatio = 0.001;
            rampartRatio = 0.05;
        }

        const damagedDefense = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax*wallRatio) ||
                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax*rampartRatio);
            }
        });
        const myStorage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE
            }
        });
        const damagedStruct = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.75) ||
                    (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
            }
        });
        const carryTotal = _.sum(creep.carry);

        if (carryTotal == 0 && !creep.memory.harvesting) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.harvesting && carryTotal == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting && carryTotal < creep.carryCapacity) {
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var tomb = creep.pos.findClosestByRange(FIND_TOMBSTONES);
            const containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
                }
            });

            if (!closestHostile && tomb) {
                if (_.sum(tomb.store) > 0) {
                    if (creep.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tomb, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    if (creep.room.name == 'W23N29') {
                        if (containers.length > 0) {
                            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                            }
                        }
                    } else if (creep.room.name == 'W23N28') {
                        if (containers.length > 0) {
                            if (creep.withdraw(containers[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(containers[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                            }
                        }
                    } else if (creep.room.name == 'W22N28') {
                        if (containers.length > 0) {
                            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                            }
                        }
                    }
                }
            } else if (!closestHostile && !tomb && dropped) {
                if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropped, {visualizePathStyle: {stroke: '#ffaa00'}});

                }
            } else {
                if (creep.room.name == 'W23N29') {
                    if (containers.length > 0) {
                        if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                } else if (creep.room.name == 'W23N28') {
                    if (containers.length > 0) {
                        if (creep.withdraw(containers[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                } else if (creep.room.name == 'W22N28') {
                    if (containers.length > 0) {
                        if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }
        // transfer rare resource to my storage
        } else if (!creep.memory.harvesting && creep.carry.energy < carryTotal) {
            for (let resourceType in creep.carry) {
                if (resourceType != RESOURCE_ENERGY) {
                    if (creep.transfer(myStorage[0], resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(myStorage[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        break;
                    }
                }
            }
        // repair my structure
        } else {
            if (damagedStruct.length > 0) {
                if (creep.repair(damagedStruct[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStruct[0], {visualizePathStyle: {stroke: COLOR_YELLOW}});
                }
            } else {
                // repair the gate and the wall
                if (damagedDefense.length > 0) {
                    if (creep.repair(damagedDefense[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedDefense[0], {visualizePathStyle: {stroke: COLOR_YELLOW}});
                    }
                }
            }
        }
    }
};

module.exports = roleRepairer;
