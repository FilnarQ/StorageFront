import { Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from 'src/app/models/File';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent {
  @Input()
  file:File = {id:"", name:"", type:"", size:0, path:""}
  @Input()
  autoLoad:boolean = false
  @Output('delete')
  deleteEmitter:EventEmitter<string> = new EventEmitter<string>()
  url:string = "";
  dragActive:boolean = false;

  constructor(public sanitizer:DomSanitizer){}

  dragDownload(event: DragEvent)
  {
    if(!event.dataTransfer||!event.target) return
      event.dataTransfer.setData('DownloadURL', `${this.file.type}:${this.file.name}:${this.url}`);
  }
  delete()
  {
    this.deleteEmitter.emit(this.file.id);
  }

  ngOnInit(){
    if(this.autoLoad&&this.file.size<1024*1024*25||this.file.type.split('/')[0]=='image') this.loadBlob();
  }
  loadBlob()
  {
    fetch(`https://localhost:7091/files/download?path=${this.file.path}&name=${this.file.name}`).then(res=>res.blob()).then(blob=>{
      this.url = URL.createObjectURL(blob)
      console.log(this.url)
      this.dragActive = true;
    })
  }
}
