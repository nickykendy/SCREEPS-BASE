var roleClaimer = {

    run: function(creep) {
        var target = Game.flags.Attack;
        if (creep.room.name == 'W22N28') {
            var control = Game.rooms['W22N28'].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTROLLER;
                }
            });

            if (!control[0].my) {
                if (creep.claimController(control[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(control[0], {visualizePathStyle: {stroke: COLOR_RED}});
                } else if (creep.claimController(control[0]) == ERR_INVALID_TARGET) {
                    if (creep.attackController(control[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(control[0], {visualizePathStyle: {stroke: COLOR_RED}});
                    }
                }
            }
        } else {
            creep.moveTo(target, {visualizePathStyle: {stroke: COLOR_WHITE}});
        }
    }
};

module.exports = roleClaimer;
