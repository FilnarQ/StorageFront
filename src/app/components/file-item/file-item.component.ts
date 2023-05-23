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
  @Input()
  clipboardSelected:boolean = false;
  @Output('clipboardSelected')
  clipboardSelectedEmitter:EventEmitter<void> = new EventEmitter<void>()
  @Output('delete')
  deleteEmitter:EventEmitter<string> = new EventEmitter<string>()
  url:string = "";
  dragActive:boolean = false;
  remainingTime:number = 7*24*60*60*1000;
  clipboardData:Array<{type:string, data:string}> = new Array();

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

  makeSelection(e:Event)
  {
    if(this.file.type!='clipboardData'||!e||!e.target) return
    let range = new Range();
    range.setStart(e.target as Node, 0);
    range.setEnd(e.target as Node, 0);
    console.log(range);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
    this.clipboardSelectedEmitter.emit()
  }

  onCopy(e:ClipboardEvent)
  {
    e.preventDefault()
    e.stopPropagation()
    console.log('qwe')
    if(!e||!e.clipboardData) return;
    for(let i=0;i<this.clipboardData.length;i++)
    {
      e.clipboardData.setData(this.clipboardData[i].type, this.clipboardData[i].data);
    }
    for(let i=0;i<e.clipboardData.types.length;i++)
    {
      console.log(e.clipboardData.types[i])
      console.log(e.clipboardData.getData(e.clipboardData.types[i]))
    }
  }

  ngOnInit(){
    if((this.autoLoad&&this.file.size<1024*1024*25||this.file.type.split('/')[0]=='image')&&this.file.type!='clipboardData') this.loadBlob();
    if(this.file.type=='clipboardData') this.clipboardData = JSON.parse(this.file.name)
    console.log(this.clipboardData)
    this.remainingTime = 5*60*1000-(Date.now()-Number.parseInt(this.file.id))
  }
  loadBlob()
  {
    this.storage.getBlob(this.file.path, this.file.name).then(blob=>{
      this.url = URL.createObjectURL(blob)
      console.log(this.url)
      this.dragActive = true;
    })
  }
  getClass()
  {
    let classes = []
    classes.push(this.dragActive?"draggable":"not-draggable")
    if(this.clipboardSelected) classes.push('clipboard-selected')
    return classes
  }
}
