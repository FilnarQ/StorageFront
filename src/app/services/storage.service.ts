import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cell } from 'src/app/models/Cell';
import { File } from 'src/app/models/File';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  server:string = "/api"

  constructor(private http:HttpClient) { }

  getCell(cellID:string)
  {
    return this.http.get<Cell>(`${this.server}/cells/${encodeURI(cellID)}`)
  }

  uploadFile(file:globalThis.File)
  {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{path:string}>(`${this.server}/files/upload`, formData);
  }
  registerFile(file:{name:string, type:string, size:number}, filePath:string)
  {
    return this.http.post<File>(`${this.server}/files`, {name:file.name, type:file.type, size:file.size.toString(), path:filePath.split('/')[0].normalize()})
  }
  addFile(fileID:string, cellID:string)
  {
    return this.http.post(`${this.server}/cells/${encodeURI(cellID)}/add?fileID=${encodeURI(fileID)}`,{})
  }

  getFile(fileID:string)
  {
    return this.http.get<File>(`${this.server}/files/${encodeURI(fileID)}`)
  }
  deleteFile(cellID:string,fileID:string)
  {
    return this.http.post(`${this.server}/cells/${encodeURI(cellID)}/del?fileID=${encodeURI(fileID)}`,{})
  }

  getDownloadLink(path:string, name:string)
  {
    return `${this.server}/files/download?path=${encodeURI(path)}&name=${encodeURI(name)}`
  }
  async getBlob(path:string, name:string)
  {
    return await fetch(this.getDownloadLink(path,name)).then(res=>res.blob())
  }
}
