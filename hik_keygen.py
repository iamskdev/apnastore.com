#!/usr/bin/env python3

import sys
from re import search
from numpy import uint32
from requests import get
from datetime import datetime

def keygen(seed):
    magic = 0
    for i, char in enumerate(seed):
        i += 1
        magic += i * ord(char) ^ i
    # 32-bit limit apply karo
    magic = magic & 0xFFFFFFFF
    secret = str(uint32((1751873395 * magic) & 0xFFFFFFFF))
    c = str.maketrans("012345678", "QRSqrdeyz")
    return secret.translate(c)

def get_serial_date(ip):
    try:
        req = get(f"http://{ip}/upnpdevicedesc.xml", timeout=5)
    except Exception as e:
        print(f"Unable to connect to {ip}:\n{e}")
        sys.exit(-1)
    
    model_match = search("<modelNumber>(.*)</modelNumber>", req.text)
    serial_match = search("<serialNumber>(.*)</serialNumber>", req.text)

    if not model_match or not serial_match:
        print("Could not find model/serial in XML. Use manual mode.")
        sys.exit(-1)

    model = model_match.group(1)
    serial = serial_match.group(1).replace(model, "")
    datef = datetime.strptime(req.headers["Date"], "%a, %d %b %Y %H:%M:%S GMT")
    date = datef.strftime("%Y%m%d")
    return f"{serial}{date}"

if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--manual":
        serial = input("Enter short serial (e.g., D03214136): ").strip()
        date   = input("Enter date in YYYYMMDD format: ").strip()
        seed = f"{serial}{date}"
    elif len(sys.argv) == 2:
        seed = get_serial_date(sys.argv[1])
    else:
        print(f"Usage:\n  {sys.argv[0]} <ip>        # auto mode\n  {sys.argv[0]} --manual   # manual mode")
        sys.exit(1)

    print(f"Got seed: {seed}")
    key = keygen(seed)
    print(f"Generated security key: {key}")