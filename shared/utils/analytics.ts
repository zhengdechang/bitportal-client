import { NativeModules } from 'react-native'

const UMAnalyticsModule =  NativeModules.UMAnalyticsModule

const date = new Date().toLocaleDateString

// custom event:

const onEvent = (eventId: string) => UMAnalyticsModule.onEvent(eventId)

const onEventWithLabel = (eventId: string, eventLabel: string) => (
  UMAnalyticsModule.onEventWithLabel(eventId, eventLabel)
)

const onEventWithMap = (eventId: string, eventData: object) => (
  UMAnalyticsModule.onEventWithMap(eventId, {...eventData,  date})
)

const onEventWithMapAndCount = (eventId: string, eventData: object, eventNum: string) => (
  UMAnalyticsModule.onEventWithMapAndCount(eventId, {...eventData,  date}, eventNum)
)

// track event:

const onEventTrack = (eventName: string) => UMAnalyticsModule.track(eventName)

const onEventTrackWithMap = (eventName: string, property: object) => (
  UMAnalyticsModule.trackWithMap(eventName, {...property,  date})
)

const onEventObject = (eventname: string, eventData: object) => {
  // AnalyticsUtil.onEventObject(eventId, {...eventData, date })
}

export {
  onEvent,
  onEventWithLabel,
  onEventWithMap,
  onEventWithMapAndCount,
  onEventTrack,
  onEventTrackWithMap,
  onEventObject
}
