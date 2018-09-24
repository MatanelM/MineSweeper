import { Component } from '@angular/core';
import { state } from './common/State';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mine Sweeper!';
  
  public game_format = {
    level: "",
    game_over : "",
    blocks_open: "",
    blocks_to_win: "",
  }

}
