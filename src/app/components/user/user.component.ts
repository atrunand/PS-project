import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { dataPallet } from './PalletDetail';
import { ApiService } from 'src/app/service/api.service';

import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExportToCsv } from 'export-to-csv';

// date function //
export class DateF {
  from!: Date;
}
export class DateT {
  to!: Date;
}
export class DateIn {
  inp!: Date;
}

// export file to excel //
const EXCEL_TYPE ='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

// export file to csv //
const options = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  title: 'CSV',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
};

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})


export class UserComponent implements OnInit {
  url1 = './assets/data.json';
  url2 = './assets/status.json';
  url3 = './assets/remark.json';
  url4 = './assets/valueInStoreall.json';
  url5 = './assets/valueInStorePerCus.json';

  // status at Search pallet //
  Res1: any = [];

  // status at Input pallet //
  Res2: any = [];
  Sta2: any = [];

  // remark at Input pallet //
  Res3: any = [];

  // value In Store All //
  response4:any;
  Res4: any = [];

  // value In Store per Customer //
  response5:any;
  Res5: any = [];

  // date function
  datef = new DateF();
  datet = new DateT();
  datein = new DateIn();
  _dat: any;
  defaultDate: any;

  // getSearch() function //
  search!: Search;

  // convertData() function //
  convData: string | undefined;
  object: any;

  // getDataPallet() function //
  dataUse: any;

  // enterData() function //
  myname: string | undefined;
  myDateF: any;
  myDateT: any;
  mySta: string | undefined;

  // checkConditionData() function //
  keepdata!: any;
  p_data: any = [];
  myDataPallet: dataPallet = new dataPallet();
  PalletData: any = [];

  // postDataPallet() function //
  formValue!: FormGroup;

  // displayTable() function //
  StatusTable: boolean = false;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {

    this.setDate('#dateDefault1');
    this.setDate('#dateDefault2');
    this.setDate('#dateDefault3');

    this.getStatus1();
    this.getStatus2();
    this.getRemark();
    this.getValueInStoreAll();
    this.getValueInStorePerCus();
    this.getSearch();

    this.formValue = this.fb.group({
      name: [''],
      date: [''],
      time: [''],
      pallet: [''],
      status: [''],
      qty: [''],
      remark: [''],
      log: [''],
    });

    this.getDataPallet();

  }

  // fetchData //
  getDataPallet() {
    this.api.getPalletData().subscribe((res) => {
      this.keepdata = res; // PData จะเป็นตัวแปรที่เก็บข้อมูลปัจจุบันทั้งหมด
      console.log(this.keepdata);
    });
  }

  createNewData() {
    let date = new Date();
    console.log(date.toLocaleTimeString());

    this.myDataPallet.name = this.object.Name;
    this.myDataPallet.date = this.formValue.value.date;
    this.myDataPallet.time = date.toLocaleTimeString(); //หาวิธีsetเวลา
    this.myDataPallet.pallet = 'Pallet A size xxx';
    this.myDataPallet.status = this.formValue.value.status;
    this.myDataPallet.qty = this.formValue.value.qty;
    this.myDataPallet.remark = this.formValue.value.remark;
    this.myDataPallet.log = 'User01';
  }

  pushNewData() {
    this.api.createPalletData(this.myDataPallet).subscribe(
      (res) => {
        console.log(res);
        Swal.fire('test1');
        this.formValue.reset();
        this.getDataPallet();
      },
      (err) => {
        Swal.fire('Something went wrong');
      }
    );
  }

  postDataPallet() {
    this.createNewData();
    if (this.object.Name != null) {
      this.pushNewData()
    } else if (this.object.Name == null) {
      Swal.fire('Please enter information');
    }
    console.error();
    console.log(this.PalletData);
  }


  getStatus1() {
    this.http.get<myStatus>(this.url2).subscribe((response: {}) => {
      this.Res1 = response;
    });
  }

  getStatus2() {
    this.http.get<myStatus>(this.url2).subscribe((response: {}) => {
      this.Res2 = response;
      for (let i = 0; i < this.Res2.length - 1; i++) {
        this.Sta2[i] = this.Res2[i].status;
      }
    });
  }

  getRemark() {
    this.http.get(this.url3).subscribe((response: {}) => {
      this.Res3 = response;
    });
  }

  getValueInStoreAll() {
    this.http.get(this.url4).subscribe((response:{}) => {
      this.response4 = response;
      this.Res4 = this.response4.result
    });
  }

  getValueInStorePerCus() {
    this.http.get(this.url5).subscribe((response:{}) => {
      this.response5 = response;
      this.Res5 = this.response5.result
    });
  }
  //////////////////


  // date function //
  updateFromDate(source: any) {
    this.datef.from = source.target.value;
    console.log('Date From :' + this.datef.from);
  }

  updateToDate(source: any) {
    this.datet.to = source.target.value;
    console.log('Date To :' + this.datet.to);
  }

  updateInputDate(source: any) {
    this.datein.inp = source.target.value;
    console.log('Date Input :' + this.datein.inp);
  }

  setDate(_id: any) {
    let d, m, y, data;

    this._dat = document.querySelector(_id);
    (this.defaultDate = new Date()),
      (d = this.defaultDate.getDate()),
      (m = this.defaultDate.getMonth() + 1),
      (y = this.defaultDate.getFullYear());

    if (d < 10) {
      d = '0' + d;
    }
    if (m < 10) {
      m = '0' + m;
    }

    data = y + '-' + m + '-' + d;
    // console.log(data);
    this._dat.value = data;
  }
  //////////////////


  // search function //
  convertData() {
    this.convData = JSON.stringify(this.search);
    this.object = JSON.parse(this.convData);
  }

  enterData() {
    this.myname = this.object.Name;
    this.myDateF = this.object.DateFrom;
    this.myDateT = this.object.DateTo;
    this.mySta = this.object.Status;
  }

  checkConditionData() {
     // เป็นส่วนที่ดึงข้อมูลจาก JSON มาใช้ในfunction
    this.dataUse = this.keepdata; // อยู่ใน getDataPallet()

    let m = 0;
    for (let i = 0; i < this.dataUse.length; i++) {
      if (this.myname == this.dataUse[i].name) {
        if (this.myDateF <= this.dataUse[i].date && this.myDateT >= this.dataUse[i].date) {
          if (this.mySta != undefined) {
            if (this.mySta == this.dataUse[i].status) {
              this.p_data[m] = this.dataUse[i];
              m++;
            } else if (this.mySta == 'ทั้งหมด') {
              this.p_data[m] = this.dataUse[i];
              m++;
            }
          }
        }
      }
    }
    this.PalletData = this.p_data;
    // console.log(this.PalletData); // เป็นตัวแปรที่จะเก็บข้อมูลของ Pallet ทั้งหมด เก็บในส่วนของ Input ที่ใส่ข้อมูลเพิ่มด้วย

  }

  displayTable() {
      // function แสดงผล table
      if (this.PalletData.length != 0) {
        this.StatusTable = true;
        console.log(this.StatusTable);
      } else if (this.PalletData == 0) {
        this.StatusTable = false;
        console.log(this.StatusTable);
      }
  }

  clearData() {
      this.PalletData.length = 0;
      // console.log(this.PalletData);
  }



  getSearch() {
    this.search = new Search();
  }

  onSearch() {
    this.clearData();
    this.convertData();
    this.enterData();
    this.checkConditionData();
    this.displayTable();

  }

  // exportFile function //
  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.PalletData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Sheet1: worksheet },
      SheetNames: ['Sheet1'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    const date = new Date();
    const fileName = 'PalletData.xlsx';

    FileSaver.saveAs(data, fileName);
  }

  exportToCSV() {
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(this.PalletData);
  }
  /////////////////////////
}


interface myStatus {
  status: string;
  result: Array<object>;
}

class Search {
  Name: any;
  DateFrom: any;
  DateTo: any;
  Status: any;
}


