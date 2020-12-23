export class ReadingListItem {
  constructor(id: string, txt: string, isDone: boolean) {
    this.id = id;
    this.txt = txt;
    this.isDone = isDone;
  }

  id: string;
  txt: string;
  isDone: boolean;
}
