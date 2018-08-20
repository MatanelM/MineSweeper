import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'LevelSummary'
})
export class LevelPipePipe implements PipeTransform {

  transform(level : number): string {
    switch (level) {
      case 0: return 'Easy';
      case 1: return 'Medium';
      case 2: return 'Hard';
    }
  }

}
