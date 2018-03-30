import { Component } from 'inferno';
import './registerServiceWorker';
import Canvas from './components/Canvas';
import Leaderboard from './components/Leaderboard';
import Header from './components/Header';

export default class App extends Component {

  constructor() {
    super()

    console.log( this.context );
  }

  render() {
    return (
      <main>
        <Canvas/>
        <Leaderboard/>
        <Header/>
      </main>
    );
  }
}
