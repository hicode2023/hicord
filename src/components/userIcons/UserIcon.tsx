import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { UserInfo } from '../../utils/user'
import UserAvatarIcon from './UserAvatarIcon'
export const USER_ICON_WIDTH = 64
export const USER_ICON_HEIGHT = 64

const UserIcon: Component<{ info: UserInfo }> = (props) => {
  let iconPositionDiv: HTMLDivElement
  let iconDiv: HTMLDivElement
  let imgElement: HTMLImageElement
  let userReactionElement: HTMLDivElement

  createEffect(() => {
    iconPositionDiv.style.left = `${props.info.x - USER_ICON_WIDTH / 2}px`
    iconPositionDiv.style.top = `${props.info.y - USER_ICON_HEIGHT / 2}px`
  })

  createEffect(() => {
    iconDiv.style.transform = `rotate(${props.info.deg}deg)`
  })

  createEffect(() => {
    const file = props.info.originalImage
    if (file) {
      const srcUrl = window.URL.createObjectURL(file)
      imgElement.src = srcUrl
    }
  })

  createEffect(() => {
    if (props.info.userReactionURIEncoded === undefined) {
      userReactionElement.style.display = 'none'
    } else {
      userReactionElement.style.removeProperty('display')
      userReactionElement.textContent = decodeURI(
        props.info.userReactionURIEncoded
      )
    }
  })

  return (
    <div ref={iconPositionDiv} class="absolute w-16 flex flex-col">
      <div ref={iconDiv} class="avatar">
        <div class="w-16 h-16">
          {props.info.originalImage ? (
            <img ref={imgElement} />
          ) : (
            <UserAvatarIcon avatar={props.info} />
          )}
        </div>
      </div>

      <div class="text-center text-sm absolute w-96 -bottom-8 -right-40">
        {props.info.userName}
      </div>
      <div
        ref={userReactionElement}
        class="text-center text-4xl w-16 absolute -top-12"
      />
      {props.info.muted ? (
        <div class="swap-off material-symbols-outlined absolute text-xl -bottom-2 -left-2 w-6 h-6 leading-6 rounded-full text-center text-error bg-base-200 bg-opacity-50">
          mic_off
        </div>
      ) : undefined}
    </div>
  )
}

export default UserIcon
