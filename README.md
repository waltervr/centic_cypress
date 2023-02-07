# Primeros pasos con Cypress
Este repositorio contiene una serie de pasos y scripts para iniciar con la automatización de pruebas con Cypress.

## Pre-requisitos
- Tener [Visual Studio Code](https://code.visualstudio.com/) instalado.
- Tener [NodeJS](https://nodejs.org/en/) instalado.

## 01 Preparación
1. Cree una nueva carpeta donde se va configurar el proyecto.
2. Abra la carpeta con VS Code.
- En VS Code:
- Haga click en "File" o "Archivo"
- Luego en "Open Folder" o "Abrir Carpeta"

## 02 Configurando Cypress
1. Abra una terminal dentro de VS Code (Ctrl+J) y ejecute los siguientes comandos uno después del otro: 
- `npm init -y`

![image](https://user-images.githubusercontent.com/1737635/217127971-0d1dfbe2-bbbc-4975-aa69-56dffaaafebb.png)

- `npm install cypress`

![image](https://user-images.githubusercontent.com/1737635/217128684-6955f5c0-82f4-42d0-8b8e-d2be577ab82b.png)

2. Una vez completado, abra el "Cypress Runner" con el comando `npx cypress open`
![image](https://user-images.githubusercontent.com/1737635/217129170-d785ea42-4bee-4c44-b82e-4bc89a0c0de6.png)

3. En la ventana, seleccione "E2E Testing" y luego dé click en "Continue".
4. Espere mientras se configura Cypress, seleccione el navegador de preferencia y dé click en el botón "Start E2E Testing in <Navegador>"
5. Listo, si todo salió bien deben aparecer un par de opciones:
![image](https://user-images.githubusercontent.com/1737635/217129996-e0617aad-714f-4571-b307-1ecdfa9ea93d.png)

- Scaffold example specs - esta opción va a crear una serie de ejemplos del uso de Cypress.
- Create new spec - esta opción nos brinda la opción para crear un nuevo archivo de prueba en blanco. 
6. Haga click en la opción "Create new spec" y siga las instrucciones en la pantalla de forma predeterminada.
7. Al aceptar las opciones predeterminadas, se va a ejecutar el caso de prueba de ejemplo y veremos los resultados a continuación. Además, se va a completar la estructura del proyecto en VS Code.
![image](https://user-images.githubusercontent.com/1737635/217130619-0995f391-46ec-46ce-80b0-ae3124a9260c.png)

8. Listo, ahora cerramos el navegador y el runner.

## 03 Agregar intellisense a VS Code para comandos de Cypress
1. En VS Code, en la raíz del proyecto, agregue un nuevo archivo con el nombre `jsconfig.json` y agregue lo siguiente:
```
{
    "include": [
        "./node_modules/cypress",
        "cypress/**/*.js"
    ]
}
```
2. Listo, esto nos va a permitir auto-completar código de Cypress, ver sugerencias y documentación.

## 04 Agregando el primer script
1. Dentro de la carpeta cypress/e2e/ agregue un archivo llamado `todomvc.cy.js` y agregue el siguiente código:
```
it('should navigate to the TodoMVC App', () => {
  cy.visit('http://todomvc-app-for-testing.surge.sh/')
})
```
2. Para ejecutar el test, abra el Cypress Runner con `npx cypress open`
3. El nuevo script se muestra disponible, para ejecutarlo solamente hay que darle click
4. Este script solamente abre el sitio web

## 04 Interactuando con elementos
Reemplace el código del archivo `todomvc.cy.js` con lo siguiente:
```
it('should add a new todo to the list', () => {
  cy.visit('http://todomvc-app-for-testing.surge.sh/')
  cy.get('.new-todo').type('Clean room{enter}')
  cy.get('.toggle').click()
  cy.contains('Clear completed').click()
})
```
Donde:
- `cy.get('.new-todo')` nos permite capturar el elemento a interactuar, a través del localizador `className`
- `.type('Clean room{enter}')` nos permite escribir en el campo y el `{enter}` es un comando reservado para hacer `Enter`
- `cy.get('.toggle').click()` nos permite hacer click sobre un elemento
- `cy.contains('Clear completed').click()` en vez de utilizar un localizador clásico, utilizamos un localizador relativo utilizando el texto del elemento

## 05 Validaciones
En Cypress las validaciones se hacen con Chai, utilizando el la función `.should` que recibe dos argumentos, el primero es qué vamos a validar y el segundo el valor esperado. 
Reemplace el código del archivo `todomvc.cy.js` con lo siguiente:
```
it('should add a new todo to the list', () => {
  cy.visit('http://todomvc-app-for-testing.surge.sh/')
  cy.get('.new-todo').type('Clean room{enter}')
  cy.get('label').should('have.text', 'Clean room')
  cy.get('.toggle').should('not.be.checked')
  cy.get('.toggle').click()
  cy.get('label').should('have.css', 'text-decoration-line', 'line-through')
  cy.contains('Clear completed').click()
  cy.get('.todo-list').should('not.have.descendants', 'li')
})
```
Donde:
- `cy.get('label').should('have.text', 'Clean room')` nos permite validar que la etiqueta seleccionada tenga el valor 'Clean room'
- `cy.get('.toggle').should('not.be.checked')` nos permite validar que el elemento 'toggle' no esté checkeado

## 06 Agrupando escenarios
Como buena práctica un caso de prueba solo debe validar una sola cosa, en el script anterior, se hacían tres validaciones es una sola función.
Para agrupar casos de prueba, las funciones "it", se agrupan dentro de una función "describe" a la que denominaremos "test suite".
Adicionalmente, cuando hay tests que comparten funcionalidad, podemos agrupar esta funcionalidad en una función llamada "beforeEach", la cuál se va a ejecutar antes de cada test.
A continuación el código actualizado:
```
describe('filtering', function() {

  beforeEach(() => {
    cy.visit('http://todomvc-app-for-testing.surge.sh/')
    cy.get('.new-todo').type('Clean room{enter}')
    cy.get('.new-todo').type('Learn JavaScript{enter}')
    cy.get('.new-todo').type('Use Cypress{enter}')
    cy.get('.todo-list li:nth-child(2) .toggle').click()
  })

  it('should filter "Active" correctly', () => {
    cy.contains('Active').click()
    cy.get('.todo-list li').should('have.length', 2)
  })

  it('should filter "Completed" correctly', () => {
    cy.contains('Completed').click()
    cy.get('.todo-list li').should('have.length', 1)
  })

  it('should filter "All" correctly', () => {
    cy.contains('All').click()
    cy.get('.todo-list li').should('have.length', 3)
  })
})
```

## Page Objects
El modelo de "Page Objects" permite encapsular lógica en archivos separados llamados "pages" lo que permite que el script de "test" sea más limpio y claro en su funcionamiento.
Para aplicar estos cambios en el código, primero hay que "extraer" lógica del test y agregarla en un nuevo archivo js llamado `todo-page.js` dentro de una carpeta que vamos a crear con el nombre `page-objects` dentro de la carpeta cypress.
Agregue el código siguiente:
```
export class TodoPage {
  navigate() {
    cy.visit('http://todomvc-app-for-testing.surge.sh/')
}

  addTodo(todoText) {
    cy.get('.new-todo').type(todoText + '{enter}')
  }

  toggleTodo(todoIndex) {
    cy.get(`.todo-list li:nth-child(${todoIndex + 1}) .toggle`).click()
  }

  validateTodoText(todoIndex, expectedText) {
    cy.get(`.todo-list li:nth-child(${todoIndex + 1}) label`).should('have.text', expectedText)
  }

  validateToggleState(todoIndex, shouldBeToggled) {
    const label = cy.get(`.todo-list li:nth-child(${todoIndex + 1}) label`)
    label.should(`${shouldBeToggled ? '' : 'not.'}be.checked`)
  }
}
```

Luego, el archivo de test debería quedar así:
```
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
```
Volvemos a abrir el runner y ejecutamos el test nuevamente
![image](https://user-images.githubusercontent.com/1737635/217131781-d8c28d4b-0711-4fac-8e88-73db269b51cb.png)

De esta forma se concluyen los primeros pasos con Cypress.
