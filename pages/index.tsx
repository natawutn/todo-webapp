import React, { useCallback, useEffect } from 'react'
import { Todo, TodoTable } from '../components/TodoComponents'
import { NotificationTable } from '../components/NotificationComponents'
import getConfig from 'next/config'
import env from '@beam-australia/react-env'

function compare(a: { id: number }, b: { id: number }) {
  return a.id > b.id ? 1 : a.id < b.id ? -1 : 0
}

export default function App() {
  const todoEndpoint = env('TODO_ENDPOINT') ?? ''
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [opened, setOpened] = React.useState(false)
  const [input, setInput] = React.useState<{
    title: string
    detail: string
    completed: boolean
  }>({
    title: '',
    detail: '',
    completed: false,
  })

  function toggleBox() {
    setOpened((opened) => !opened)
  }

  const handleAdd: React.MouseEventHandler<HTMLInputElement> = (event) => {
    // reset state
    setInput({
      title: '',
      detail: '',
      completed: false,
    })
    toggleBox()
    event.preventDefault()
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name as 'title' | 'detail'

    setInput((old) => ({
      ...old,
      [name]: value,
    }))
  }

  const refresh = useCallback(() => {
    fetch(todoEndpoint, { mode: 'cors' })
      .then((res) => res.json())
      .then((data) => {
        data.sort(compare)
        setTodos(data)
      })
      .catch(console.log)
  }, [todoEndpoint])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const now = new Date()
    now.setSeconds(now.getSeconds() + 5)

    const todo = {
      title: input.title,
      detail: input.detail,
      duedate: now,
      tags: [],
      completed: input.completed,
    }
    console.log('submit', todo)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    }
    fetch(todoEndpoint, requestOptions)
      .then((response) => response.json())
      .then((data) => refresh())
      .catch(console.log)

    toggleBox()
    event.preventDefault()
  }

  useEffect(() => {
    console.log('Using TODO endpoint at: ' + todoEndpoint)
    refresh()
  }, [refresh, todoEndpoint])

  return (
    <div className='app'>
      <h1>Uber To Do</h1>
      <div>
        <NotificationTable />
      </div>
      <hr />
      {!opened && (
        <div>
          <TodoTable todos={todos} />
          <hr />
          <input type='button' value='Add' onClick={handleAdd} />
        </div>
      )}
      {opened && (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input name='title' type='text' value={input.title} onChange={handleInputChange} />
            </label>
            <br />
            <br />
            <label>
              Detail:
              <input name='detail' type='text' value={input.detail} onChange={handleInputChange} />
            </label>
            <br />
            <br />
            <label>
              Completed:
              <input
                name='completed'
                type='checkbox'
                checked={input.completed}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <br />
            <input type='submit' value='Add' />
            <input type='button' value='Cancel' onClick={toggleBox} />
          </form>
        </div>
      )}
    </div>
  )
}
