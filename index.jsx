import { h, app } from "hyperapp"
import { interval } from "@hyperapp/time"

const state = {
    counting: false,
    numberOfAttendees: 0,
    averageSalary: 0,
    elapsedTimeInSeconds: 0
}

const Reset = state => ({
    ...state,
    counting: false,
    elapsedTimeInSeconds: 0
})

const StartCounting = state => ({
    ...state,
    counting: true
})

const StopCounting = state => ({
    ...state,
    counting: false
})

const calculateCurrentMeetingPrice = (numberOfAttendees, averageSalary, elapsedTimeInSeconds) => {
    return calculateTotalAverageSalaryPerSecond(numberOfAttendees, averageSalary) * elapsedTimeInSeconds
}

const calculateAverageSalaryPerSecondPerAttendee = averageSalary => {
    return averageSalary / 360 / 60 / 60
}

const calculateTotalAverageSalaryPerSecond = (numberOfAttendees, averageSalary) => {
    return calculateAverageSalaryPerSecondPerAttendee(averageSalary) * numberOfAttendees
}

const SelectNumberOfAttendees = state => {
    const UpdateNumberOfAttendees = (state, event) => ({
        ...state,
        numberOfAttendees: event.target.value
    })

    return (
        <select onchange={UpdateNumberOfAttendees}>
          {[...Array(61)].map((x, i) => <option value={i}>{i}</option> )}
        </select>
    )
}

const SelectAverageSalary = state => {
    const UpdateAverageSalary = (state, event) => ({
        ...state,
        averageSalary: event.target.value
    })

    return (
        <select onchange={UpdateAverageSalary}>
          {[...Array(51)].map((x, i) => {
              const salary = i*1000
              return <option value={salary}>{salary}</option>          
          })}
        </select>
    )
}

const Tick = (state) => {
    return state.counting ? {...state, elapsedTimeInSeconds: state.elapsedTimeInSeconds + 1} : state
}

const view = state => (
    <div>
      <h1>Meeting Price Counter</h1>
      <h2>
        Time elapsed: {state.elapsedTimeInSeconds} seconds<br />
        Money spent: ${calculateCurrentMeetingPrice(state.numberOfAttendees, state.averageSalary, state.elapsedTimeInSeconds).toFixed(2)}      
      </h2>
      Number of attendees: <SelectNumberOfAttendees isDisabled="false" />
      Average salary: <SelectAverageSalary isDisabled="false" />
      <br /><br />
      <button onclick={StartCounting}>Start counting</button>
      <button onclick={StopCounting}>Stop counting</button>      
      <button onclick={Reset}>Reset</button>      

      <br/><br/>
      <div>
        Is counting? {state.counting ? <span>yes</span> : <span>no</span>}
        <br />
        numberOfAttendees: {state.numberOfAttendees}
        <br />
        averageSalary: {state.averageSalary}      
        <br />
        calculateAverageSalaryPerSecondPerAttendee: ${calculateAverageSalaryPerSecondPerAttendee(state.averageSalary).toFixed(2)}
        <br />
        calculateTotalAverageSalaryPerSecond: ${calculateTotalAverageSalaryPerSecond(state.numberOfAttendees, state.averageSalary).toFixed(2)}
      </div>
    </div>
)

const main = app({
    init: () => state,
    view: view,
    node: document.getElementById("app"),    
    subscriptions: state => [
        interval({
            action: Tick,
            delay: 1000
        })
    ]
})
