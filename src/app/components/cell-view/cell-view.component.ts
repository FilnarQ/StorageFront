import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Cell } from 'src/app/models/Cell';
import { File } from 'src/app/models/File';

@Component({
  selector: 'app-cell-view',
  templateUrl: './cell-view.component.html',
  styleUrls: ['./cell-view.component.scss']
})
export class CellViewComponent {
  _cellID:string = ""
  _autoLoad:boolean = false
  cell$ = this.http.get<Cell>(`https://localhost:7091/cells/${this._cellID}`)
  files:Array<Observable<File>>|null = null
  constructor(private route:ActivatedRoute, private http:HttpClient){}

  upload(event:Event)
  {
    let fileID:string
    let filePath:string
    let target = event.target as HTMLInputElement;
    let file = target.files?target.files[0]:null;
    if(file==null) return
    if(file.size>1024*1024*50)
    {
      return
    }
    const formData = new FormData();
    formData.append("file", file);
    const fileUpload$ = this.http.post<{path:string}>(`https://localhost:7091/files/upload`, formData);
    fileUpload$.subscribe(res=>{
      filePath = res.path;
      console.log(filePath)
      if(file==null) return
      this.http.post<File>(`https://localhost:7091/files`, {name:file.name, type:file.type, size:file.size.toString(), path:filePath.split('/')[0].normalize()}).subscribe(res=>{
        fileID = res.id;
        this.http.post(`https://localhost:7091/cells/${this._cellID}/add?fileID=${fileID}`,{}).subscribe(()=>this.ngOnInit())
      })
    })
  }
  delete(fileID:string)
  {
    this.http.post(`https://localhost:7091/cells/${this._cellID}/del?fileID=${fileID}`,{}).subscribe(()=>this.load())
  }
  load()
  {
    this.cell$.subscribe(res=>{
      let tempFiles = res.files.map(el=>this.http.get<File>(`https://localhost:7091/files/${el}`))
      this.files = tempFiles;
    })
  }
  ngOnInit()
  {
    this.route.queryParams.subscribe(params=>{
      this._cellID = params['id'];
      this._autoLoad = params['load']=="true";
      this.cell$ = this.http.get<Cell>(`https://localhost:7091/cells/${this._cellID}`)
      this.load()
    })
  }
  trackByFunc(index: number):number
  {
    return index;
  }
}
