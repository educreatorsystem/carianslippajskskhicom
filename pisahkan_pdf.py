#!/usr/bin/env python3
"""Asingkan PDF PAJSK pukal menjadi PDF individu mengikut nombor MyKad.
Penggunaan: pip install pymupdf
            python pisahkan_pdf.py /lokasi/PAJSK_PUKAL.pdf --output slip_individu
Jalankan di komputer guru. Jangan muat naik PDF hasil ke GitHub awam.
"""
import argparse,re,csv,sys
from pathlib import Path
import fitz

def extract_ic(s):
    matches=re.findall(r'NO\.?\s*MYKAD\s*[:\s]*(\d{12})',s,re.I)
    return matches[0] if matches else None

def run(source,target):
    doc=fitz.open(source);starts=[]
    for idx,page in enumerate(doc):
        text=page.get_text(sort=True)
        ic=extract_ic(text)
        if ic: starts.append((idx,ic))
    if not starts:raise ValueError('Tiada NO. MYKAD ditemui. Mungkin PDF diimbas sebagai imej atau format berbeza.')
    if starts[0][0]!=0:raise ValueError('PDF mempunyai halaman sebelum slip pertama; semak secara manual dahulu.')
    if len(set(v for _,v in starts))!=len(starts):raise ValueError('Nombor MyKad berulang dalam PDF ini. Asingkan mengikut sesi sebelum proses.')
    target=Path(target);target.mkdir(parents=True,exist_ok=True)
    rows=[]
    for i,(start,ic) in enumerate(starts):
        end=starts[i+1][0]-1 if i+1<len(starts) else len(doc)-1
        part=fitz.open();part.insert_pdf(doc,from_page=start,to_page=end)
        path=target/(ic+'.pdf');part.save(path,garbage=4,deflate=True)
        part.close();rows.append([ic,start+1,end+1,str(path.name)])
    with (target/'semakan_slip.csv').open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.writer(f);w.writerow(['mykad','halaman_mula','halaman_akhir','nama_fail']);w.writerows(rows)
    print('SELESAI:',len(rows),'slip,',len(doc),'halaman, folder:',target)
    print('SEMAK 2-3 slip dan padanan MyKad sebelum muat naik ke Google Drive.')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('pdf');parser.add_argument('--output',default='slip_individu');args=parser.parse_args()
    try:run(args.pdf,args.output)
    except Exception as exc:print('RALAT:',exc,file=sys.stderr);sys.exit(1)
