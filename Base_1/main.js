var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleAttacker = require('role.attacker');
var roleClaimer = require('role.claimer');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var roleExpander = require('role.expander');
var roleGatherer = require('role.gatherer');
var spawnNewCreep = require('spawnCreep');
var towerCommand = require('towerCommand');

module.exports.loop = function () {
    for (let roomName in Game.rooms) {
        for (let spawnName in Game.spawns) {
            if (Game.spawns[spawnName].room.name == roomName) {
                const extensions = Game.rooms[roomName].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_EXTENSION;
                    }
                });
                const energyAll = 300 + extensions.length * 50;
                const sources = Game.spawns[spawnName].room.find(FIND_SOURCES);


                Game.spawns[spawnName].room.visual.text(
                    '🥮: ' + Game.rooms[roomName].energyAvailable + " / " + energyAll,
                    Game.spawns[spawnName].pos.x - 5,
                    Game.spawns[spawnName].pos.y + 10,
                    {align: 'left', opacity: 0.8}
                );
                towerCommand.run(spawnName, roomName);
                spawnNewCreep.run(creep, spawnName, roomName);

                for (let name in Game.creeps) {
                    var creep = Game.creeps[name];
                    if (creep.memory.role == 'harvester') {
                        roleHarvester.run(creep);
                    }
                    if (creep.memory.role == 'upgrader') {
                        roleUpgrader.run(creep);
                    }
                    if (creep.memory.role == 'builder') {
                        roleBuilder.run(creep);
                    }
                    if (creep.memory.role == 'attacker') {
                        roleAttacker.run(creep);
                    }
                    if (creep.memory.role == 'claimer') {
                        roleClaimer.run(creep);
                    }
                    if (creep.memory.role == 'repairer') {
                        roleRepairer.run(creep);
                    }
                    if (creep.memory.role == 'miner') {
                        roleMiner.run(creep);
                    }
                    if (creep.memory.role == 'expander') {
                        roleExpander.run(creep);
                    }
                    if (creep.memory.role == 'gatherer') {
                        roleGatherer.run(creep);
                    }
                }
            }
        }
    }
}
