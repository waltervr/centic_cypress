import {TodoPage} from '../page-objects/todo-page'

describe('todo actions', () => {
  const todoPage = new TodoPage()

  beforeEach(() => {
    todoPage.navigate()
    todoPage.addTodo('Clean room')
  })

  it('should add a new todo to the list', () => {
    todoPage.validateTodoText(0, 'Clean room')
    todoPage.validateToggleState(0, false)
  })
})