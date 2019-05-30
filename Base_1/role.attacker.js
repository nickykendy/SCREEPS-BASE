var roleAttacker = {

    run: function(creep) {
        var target = Game.flags.Attack;
        if (creep.room.name == 'W23N28') {
            var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (enemy) {
                if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy, {visualizePathStyle: {stroke: COLOR_RED}});
                }
            }
        } else {
            creep.moveTo(target);
        }
    }
};

module.exports = roleAttacker;
