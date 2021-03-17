import React, { Component } from 'react';
import './App.css';
import { GiTrashCan } from 'react-icons/gi'; //Icon


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: {},
      name: '',
      kind: '',
      nextId: 0,

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.requestUrl = 'https://1w8740af1c.execute-api.eu-central-1.amazonaws.com/Test';
  }
  //wird bei Website-Aufruf direkt ausgeführt
  async componentDidMount() {
    try {
      fetch(this.requestUrl) //default Request = GET Rerquest
        .then(response => response.json())
        .then(data => this.setState({
          isLoading: false,
          dataSource: JSON.parse(data.body).Items.sort((a, b) => a.Id > b.Id ? 1 : -1),
        }))
    } catch (error) {
      console.error(error);
    }
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleSubmit(event) {
    this.setState({
      isLoading: true
    })
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    };

    try {
      fetch(this.requestUrl + '?name=' + this.state.name + '&kind=' + this.state.kind + '&id=' + this.state.nextId, requestOptions) //POST Request mit Request params
        .then(response => response.json())
        .then(data => window.location.reload())
    } catch (error) {
      console.error(error);
    }
  }

  handleDelete(id) {

    this.setState({
      isLoading: true
    })


    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    };

    try {
      fetch(this.requestUrl + '?id=' + id, requestOptions) //DELETE Request mit request param
        .then(response => response.json())
        .then(data => window.location.reload())
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    console.log(this.state.nextId);
    let { dataSource } = this.state;
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h1>Tierpension Verwaltung</h1>
          <table id="t01">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Tierart</th>
              <th>Aktion</th>
            </tr>
            {dataSource.sort((a, b) => a.Id > b.Id ? 1 : -1).map(data =>
              <tr>
                {this.setState({
                  nextId: data.Id
                })}
                <td>{data.Id}</td>
                <td>{data.Name}</td>
                <td>{data.Tierart}</td>
                <td><button id={data.Id} onClick={() => this.handleDelete(data.Id)}><GiTrashCan /></button></td>
              </tr>

            )}
          </table>
          <h2> Tier hinzufügen</h2>
          <form onSubmit={this.handleSubmit}>
            <label> Name  </label>
            <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} />
            <label> Tierart  </label>
            <input type="text" name="kind" id="kind" value={this.state.kind} onChange={this.handleChange} />
            <input type="submit" value="Hinzufügen" />
          </form>
        </div >
      );
    }
  }
}


export default App;