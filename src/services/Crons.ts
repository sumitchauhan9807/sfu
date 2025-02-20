import {mediaSoup} from '../index'
import { End_Model_Session } from './system'

export const TransportsCheck = async () => {
  let rooms = mediaSoup.rooms
  if(!rooms.length){ 
    console.log("NO ROOMS FOUND")
  }
  rooms.forEach(async (room:any)=>{
    // console.log(room)
    let model = room.modelId
    // console.log(model)
    let bytesReceived = room.bytesReceived
    let modelTransport = room.transport
    let stats = await modelTransport.getStats()
    if(bytesReceived == 0) {
      console.log("MONITORING ROOM FIRST TIME")
      mediaSoup.updateRoomBytesReceived(model,stats[0].bytesReceived)
    }else {
      let previousBytesReceived = bytesReceived
      let currentBytesReceived = stats[0].bytesReceived
      if(previousBytesReceived == currentBytesReceived) {
        console.log(model," THIS HAS TO BE REMOVED")
        End_Model_Session(model)
        // remove producer transport and all sub consumer transports !!!
        mediaSoup.removeRoom(model)
      }else {
        console.log("UPDATING THE BYTES RECEIVED ",formatBytes(stats[0].bytesReceived))
        mediaSoup.updateRoomBytesReceived(model,stats[0].bytesReceived)
        ConsumnerTransportCheck(model)
      }
    }
    // console.log(`PRODUCER (${model})`, formatBytes(stats[0].bytesSent), formatBytes(stats[0].bytesReceived))
  })  
}

const ConsumnerTransportCheck = (model:String) => {
  let modelRoom = mediaSoup.rooms.find((room:any) => room.modelId == model)
  if(!modelRoom) return 
  let modelId = modelRoom.modelId
  let consumers = modelRoom.consumers
  consumers.forEach(async (consumer:any) => {
    let bytesSent = consumer.bytesSent
    let consumerTransport = consumer.transport
    let stats = await consumerTransport.getStats()
    let clientId = consumer.clientId
    if(bytesSent == 0){ 
      console.log("MONITORING CLIENT FIRST TIME")
      mediaSoup.updateConsumerBytesSent(modelId,clientId,stats[0].bytesSent)
    }else { 
      let previousBytesSent = bytesSent
      let currentBytesSent = stats[0].bytesSent
      if(previousBytesSent == currentBytesSent) {
        console.log(" THIS CLIENT HAS TO BE REMOVED")
        mediaSoup.removeConsumerTransport(modelId,clientId)
      }else { 
        console.log("UPDATING THE BYTES RECEIVED CONSUMER " ,formatBytes(stats[0].bytesSent))
        mediaSoup.updateConsumerBytesSent(modelId,clientId,stats[0].bytesSent)
      }
    }
  });
}

function formatBytes(bytes:any, decimals = 2) {
  bytes = Number(bytes)
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}