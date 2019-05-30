var roleGatherer = {

    run: function(creep) {
        const sources = creep.room.find(FIND_SOURCES);
        const closeContainer = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        if (closeContainer.hits < closeContainer.hitsMax * 0.9) {
            if (creep.repair(closeContainer) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closeContainer, {visualizePathStyle: {stroke: COLOR_YELLOW}});
            }
        } else {
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleGatherer;
