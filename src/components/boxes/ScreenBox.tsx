/* eslint-disable solid/prefer-for */
import { createMemo, createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import {
  ScreenBoxInfo,
  getScreenInfos,
  setMediaStreamEventListener,
} from '../../utils/screen'
import RoomBox from './RoomBox'
import { getUserNameFromPeerId } from '../../utils/user'
import { setRoomBoxInfo } from '../../utils/box'
import { sendRoomBoxInfoToAll } from '../../utils/send/sendRoomBoxInfo'
import { PEER } from '../Room'

const ScreenBox: Component<{ info: ScreenBoxInfo }> = (props) => {
  let videoRef: HTMLVideoElement

  const getScreenInfo = createMemo(() => {
    const screenInfo = getScreenInfos().find(
      (screen) => screen.mStream.id === props.info.mStreamId
    )

    if (screenInfo === undefined) {
      const mediaConnection = PEER.call(props.info.peerId, undefined, {
        metadata: {
          mStreamId: props.info.mStreamId,
        },
      })
      console.log(`call screen to ${mediaConnection.remoteId}`)

      setMediaStreamEventListener(mediaConnection)
      // TODO: delete ScreenInfo and ScreenBoxInfos
      // mediaConnection.once('close', () => {
      // })
    }

    return screenInfo
  })

  createEffect(() => {
    // Set stream to video element
    if (getScreenInfo()) {
      videoRef.srcObject = getScreenInfo().mStream
      videoRef.play().catch((e) => console.log(e))
      videoRef.muted = true

      videoRef.addEventListener(
        'loadedmetadata',
        function (this: HTMLVideoElement) {
          const width = this.clientWidth
          const height = this.clientHeight
          if (
            width &&
            height &&
            (props.info.width !== width || props.info.height !== height)
          ) {
            console.log(width, height)
            const screenBox: ScreenBoxInfo = {
              ...props.info,
              width,
              height,
            }
            setRoomBoxInfo(screenBox)
            sendRoomBoxInfoToAll(screenBox)
          }
        },
        false
      )
    }
  })

  return (
    <RoomBox boxInfo={props.info} class="screen-box">
      <video ref={videoRef} />
      <div class="absolute left-2" style={{ top: '-1.5rem' }}>
        {getUserNameFromPeerId(props.info.peerId)}
      </div>
    </RoomBox>
  )
}

export default ScreenBox