var roleGatherer = {

    run: function(creep) {
        const sources = creep.pos.findClosestByRange(FIND_SOURCES);
        const myContainers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        });

        if (creep.memory.gender == 'male') {
            creep.moveTo(myContainers[0].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            creep.harvest(sources);
        } else {
            creep.moveTo(myContainers[1].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            creep.harvest(sources);
        }
    }
};

module.exports = roleGatherer;
