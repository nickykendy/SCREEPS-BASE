var roleExpander = {

    run: function(creep) {
        var target = Game.flags.Attack;
        if (creep.room.name == 'W22N28') {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
            }

            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('🚧 build');
            }

            if (creep.memory.building) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else {
                var sources;
                if (creep.room.name == 'W23N29') {
                    sources = creep.room.find(FIND_SOURCES_ACTIVE);
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else if (creep.room.name == 'W23N28') {
                    sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else if (creep.room.name == 'W22N28') {
                    sources = creep.room.find(FIND_SOURCES);
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        } else {
            creep.moveTo(target, {visualizePathStyle: {stroke: COLOR_WHITE}});
        }
    }
};

module.exports = roleExpander;