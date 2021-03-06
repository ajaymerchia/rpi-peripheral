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
        rcWrite: {id: '2a9d9cdf-ff0b-4447-a110-5742655102f2'},
        datesync: {id: 'd845636d-6bdc-4630-a2d0-dd779af11bd3'},
        name: {id: 'c91d04a0-c3b7-4e64-b1cf-118933e3f985'}
      }
    },
    routine: {
      id: "a226b9d9-95f2-4045-ab7c-08a4c738b700",
      characteristics: {
        routinereceive: {id: "a226b9d9-95f2-4045-ab7c-08a4c738b701"},
        player: {id: "a226b9d9-95f2-4045-ab7c-08a4c738b702"}
      }
    },
    network: {
      id: "ae98b9a9-9b2f-429b-842c-4c917c5aba5a",
      characteristics: {
        scan: {id: "7aef3840-9e5c-460f-a960-4a24fa62db6e"},
        connect: {id: "f09e8654-7cf9-4b13-a489-899d608159cc"},
        disconnect: {id: "9abaab33-3e74-406b-be92-511f5ea6cd31"},
        forget: {id: "b50920d9-d1b6-4e6e-8fc2-ebe33a9166c1"}
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
