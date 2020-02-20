// see https://www.uuidgenerator.net for UUIDs
// Modify generated IDs so that services have IDs with 0 endings and their characteristics enumerate 1-9a-f
module.exports = {
  auth: '25bd390c-65b7-4ce1-b09e-af670db83c12',
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
        shutdown: {id: 'c5bc539e-46f3-435c-84f6-e8989449d3d6'},
        version: {id: '1702b9e8-bbce-4660-8fc9-a978e314d19c'},
        datesync: {id: 'd845636d-6bdc-4630-a2d0-dd779af11bd3'}
      }
    },
    routine: {
      id: "a226b9d9-95f2-4045-ab7c-08a4c738b700",
      characteristics: {
        routinereceive: {id: "a226b9d9-95f2-4045-ab7c-08a4c738b701"},
        player: {id: "a226b9d9-95f2-4045-ab7c-08a4c738b702"}
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
