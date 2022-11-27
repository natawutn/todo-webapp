export interface Todo {
  id: number
  title: string
  detail: string
  completed: boolean
  duedate: Date
}

function TodoRow(props: { todo: Todo }) {
  const dueDate = new Date(props.todo.duedate)
  return (
    <tr>
      <td>{props.todo.completed ? <input type='checkbox' /> : <span>&nbsp;</span>}</td>
      <td>
        <b>{props.todo.title}</b>
        <br />
        {props.todo.detail}
        <br />
        {dueDate.toString()}
      </td>
    </tr>
  )
}

export function TodoTable(props: { todos: Todo[] }) {
  return (
    <div>
      <hr />
      <table>
        <tbody>
          {props.todos.map((todo, index) => (
            <TodoRow todo={todo} key={todo.id} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
