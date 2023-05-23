import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  @Output('dataPaste')
  dataPaste = new EventEmitter<any>()
  @Output('appDnd')
  fileDrop = new EventEmitter<any>()
  @Output('existingFile')
  fileMove = new EventEmitter<any>()
  @HostBinding('class.drop-zone-active')
  active = false;
  @HostBinding('class.drop-zone-file-size')
  sizeError = false;
  constructor() { }
  
  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this.active = false;
    this.sizeError = false;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    if(false)
    {
      this.sizeError = true;
    }
    else
    {
      this.active = true;
    }
  }

  

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.clipboardData?.items) {
      const files = [];
      const data:Array<{type:string, data:string}> = [];
      for (let i = event.clipboardData.items.length-1; i>=0; i--) {
        if (event.clipboardData.items[i].kind === 'file') {  
          files.push(event.clipboardData.items[i].getAsFile());
        }
        else if(event.clipboardData.items[i].kind === 'string'){
          let type = event.clipboardData.items[i].type;
          console.log(event.clipboardData.items[i])
          event.clipboardData.items[i].getAsString((s:string)=>{
            console.log(s)
            data.push({type:type??"null", data:s});
            if(i==0)
            {
              let w = {items:data}
              this.dataPaste.emit(w);
            }
          });
        }
      }
      console.log("await check " + data)
      event.clipboardData.items.clear();
      let q = {target:{files:files}}
      this.fileDrop.emit(q);
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    if(this.sizeError)
    {
      this.sizeError = false;
      return;
    }
    this.active = false
    const { dataTransfer } = event;
    if(!dataTransfer) return
    if(dataTransfer.getData('fileID'))
    {
      let q = {fileID: dataTransfer.getData("fileID"), originCell:dataTransfer.getData("originCell")}
      this.fileMove.emit(q);
    } else if (dataTransfer.items) {
      const files = [];
      for (let i = 0; i < dataTransfer.items.length; i++) {
        if (dataTransfer.items[i].kind === 'file') {  
          files.push(dataTransfer.items[i].getAsFile());
        }
      }
      dataTransfer.items.clear();
      let q = {target:{files:files}}
      this.fileDrop.emit(q);
    } else {
      const files = dataTransfer.files;
      dataTransfer.clearData();
      let q = {target:{files:files}}
      this.fileDrop.emit(q);
    }
  }

  @HostListener('body:drop', ['$event'])
  onBodyDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation()
  }
  @HostListener('body:dragover', ['$event'])
  onBodyDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
