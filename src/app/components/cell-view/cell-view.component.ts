import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { File } from 'src/app/models/File';

@Component({
  selector: 'app-cell-view',
  templateUrl: './cell-view.component.html',
  styleUrls: ['./cell-view.component.scss']
})
export class CellViewComponent {
  _cellID:string = ""
  _autoLoad:boolean = false
  cell$ = this.storage.getCell(this._cellID)
  files:Array<Observable<File>>= new Array
  addFileById:string = ""
  constructor(private route:ActivatedRoute, private http:HttpClient, private storage:StorageService){}

  upload(event:Event)
  {
    let target = event.target as HTMLInputElement;
    let file = target.files?target.files[0]:null;
    if(file==null||file.size>1024*1024*50) return
    this.storage.uploadFile(file).subscribe(res=>{
      if(file==null) return
      this.storage.registerFile(file, res.path).subscribe(res=>{
        this.storage.addFile(res.id, this._cellID).subscribe(res=>{
          this.ngOnInit()
        })
      })
    })
  }
  addById(fileID:string, originCell?:string)
  {
    if(originCell==this._cellID) return
    this.storage.addFile(fileID, this._cellID).subscribe(res=>{
      if(res=="Wrong file id") return
      this.ngOnInit()
    })
  }
  delete(fileID:string)
  {
    this.storage.deleteFile(this._cellID, fileID).subscribe(()=>this.load())
  }


  load()
  {
    this.cell$.subscribe(res=>{
      let tempFiles = res.files.map(fileID=>this.storage.getFile(fileID))
      this.files = tempFiles;
    })
  }
  ngOnInit()
  {
    this.route.queryParams.subscribe(params=>{
      this._cellID = params['id'];
      this._autoLoad = params['load']=="true";
      this.cell$ = this.storage.getCell(this._cellID);
      this.load()
    })
  }
  trackByFunc(index: number):number
  {
    return index;
  }
}
