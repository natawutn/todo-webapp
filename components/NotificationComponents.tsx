import env from '@beam-australia/react-env'
import getConfig from 'next/config'
import { useEffect, useMemo, useState } from 'react'

export interface Notification {
  title: string
}

function NotificationRow({ notification }: { notification: Notification }) {
  return (
    <tr>
      <td>
        <b>{notification.title}</b>
      </td>
    </tr>
  )
}

export function NotificationTable() {
  const notificationEndpoint = env('NOTIFICATION_ENDPOINT') ?? 'http://localhost:9000'
  const [lastSeen, setLastSeen] = useState(0)
  const [numNew, setNumNew] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const date = useMemo(() => {
    const d = new Date(0)
    d.setUTCSeconds(lastSeen)
    return d.toString()
  }, [lastSeen])

  useEffect(() => {
    function refreshBadge() {
      // check Notification service using last_seen to update numNotificaitons
      const now = Math.round(Date.now() / 1000)
      const url = `${notificationEndpoint}?begin=${lastSeen + 1}&end=${now}`
      setLastSeen(now)

      fetch(url, { mode: 'cors' })
        .then((res) => res.json())
        .then((data) => {
          const notifications = data
          console.log(data)
          if (Array.isArray(notifications)) {
            setNumNew(numNew + data.length)
            setNotifications(notifications)
          }
        })
        .catch(console.log)
    }
    const timerId = setInterval(() => refreshBadge(), 3000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
    <div>
      {numNew} ({date})
      <br />
      <hr />
      <table>
        <tbody>
          {notifications?.map((notification, i) => (
            <NotificationRow notification={notification} key={i} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
