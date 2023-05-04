import { Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from 'src/app/models/File';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent {
  @Input()
  currentCell:string = ""
  @Input()
  file:File = {id:"", name:"", type:"", size:0, path:""}
  @Input()
  autoLoad:boolean = false
  @Output('delete')
  deleteEmitter:EventEmitter<string> = new EventEmitter<string>()
  url:string = "";
  dragActive:boolean = false;

  constructor(public sanitizer:DomSanitizer, public storage:StorageService){}

  dragDownload(event: DragEvent)
  {
    if(!event.dataTransfer||!event.target) return
      event.dataTransfer.setData('DownloadURL', `${this.file.type}:${this.file.name}:${this.url}`);
      event.dataTransfer.setData('fileID', this.file.id);
      event.dataTransfer.setData('originCell', this.currentCell)
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
    this.storage.getBlob(this.file.path, this.file.name).then(blob=>{
      this.url = URL.createObjectURL(blob)
      console.log(this.url)
      this.dragActive = true;
    })
  }
}
