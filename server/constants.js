// see https://www.uuidgenerator.net for UUIDs
// Modify generated IDs so that services have IDs with 0 endings and their characteristics enumerate 1-9a-f
module.exports = {
  uuids: {
    pingpong: {
      id: "8e66b5c3-9851-4a29-8252-295ad263f4b0",
      characteristics: {
        pingpong: {id: '8e66b5c3-9851-4a29-8252-295ad263f4b1'}
      }
    },
    sysinfo: {
      id: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb00',
      characteristics: {
        memory: {id: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb01'},
        uptime: {id: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb02'},
        loadaverage: {id: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb03'},
      }
    }
  }
}

module.exports.uuidFor = (filename) => {

  const path = filename.replace(".", "/").split("/")
  var pathIdx = path.indexOf("services") + 1

  var curr = module.exports.uuids

  for (; pathIdx < path.length; pathIdx++) {
    var nxt = path[pathIdx]
    if (nxt === "js") {
      nxt = "id"
    } else if (nxt == "service") {
      continue
    }
    curr = curr[nxt]
  }

  return curr

}
