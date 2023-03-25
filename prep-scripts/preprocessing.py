import pandas as pd
from typing import Iterable
import os
import tqdm
import json
import datetime


def get_raw_data(name: str) -> Iterable[object]:
    if name != "photo":
        path = os.path.join("data", "raw", "yelp_dataset", f"yelp_academic_dataset_{name}.json")
    else:
        path = os.path.join("data", "raw", "yelp_photos", "photos.json")

    total_lines = {
        "business": 150_436,
        "review": 6_990_280,
        "user": 1_987_897,
        "tip": 908_915,
        "photo": 200_100,
    }
    with open(path, "r", encoding="utf-8") as f:
        for line in tqdm.tqdm(f, total=total_lines[name]):
            obj = json.loads(line)
            yield obj


def create_business():
    good_created = False
    bad_created = False

    direct_fields = [
        "business_id",
        "name",
        "address",
        "city",
        "state",
        "postal_code",
        "latitude",
        "longitude",
        "is_open",
    ]

    us_states = set(
        [
            "AL",  # Alabama
            "AK",  # Alaska
            "AZ",  # Arizona
            "AR",  # Arkansas
            "CA",  # California
            "CO",  # Colorado
            "CT",  # Connecticut
            "DE",  # Delaware
            "FL",  # Florida
            "GA",  # Georgia
            "HI",  # Hawaii
            "ID",  # Idaho
            "IL",  # Illinois
            "IN",  # Indiana
            "IA",  # Iowa
            "KS",  # Kansas
            "KY",  # Kentucky
            "LA",  # Louisiana
            "ME",  # Maine
            "MD",  # Maryland
            "MA",  # Massachusetts
            "MI",  # Michigan
            "MN",  # Minnesota
            "MS",  # Mississippi
            "MO",  # Missouri
            "MT",  # Montana
            "NE",  # Nebraska
            "NV",  # Nevada
            "NH",  # New Hampshire
            "NJ",  # New Jersey
            "NM",  # New Mexico
            "NY",  # New York
            "NC",  # North Carolina
            "ND",  # North Dakota
            "OH",  # Ohio
            "OK",  # Oklahoma
            "OR",  # Oregon
            "PA",  # Pennsylvania
            "RI",  # Rhode Island
            "SC",  # South Carolina
            "SD",  # South Dakota
            "TN",  # Tennessee
            "TX",  # Texas
            "UT",  # Utah
            "VT",  # Vermont
            "VA",  # Virginia
            "WA",  # Washington
            "WV",  # West Virginia
            "WI",  # Wisconsin
            "WY",  # Wyoming
        ]
    )

    for obj in get_raw_data("business"):
        result_obj = {k: obj.get(k, None) for k in direct_fields}

        for dow in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]:
            Dow = dow.capitalize()

            try:
                start, end = obj["hours"][Dow].split("-")
                start_hour, start_minute = map(int, start.split(":"))
                end_hour, end_minute = map(int, end.split(":"))

                result_obj[f"{dow}_start"] = datetime.time(hour=start_hour, minute=start_minute)
                result_obj[f"{dow}_end"] = datetime.time(hour=end_hour, minute=end_minute)

            except:
                result_obj[f"{dow}_start"] = None
                result_obj[f"{dow}_end"] = None

        df = pd.DataFrame([result_obj]).astype(
            {
                "business_id": str,
                "name": str,
                "address": str,
                "city": str,
                "state": str,
                "postal_code": str,
                "latitude": float,
                "longitude": float,
                "is_open": bool,
            }
        )

        is_good = df[direct_fields].notnull().all().all() and result_obj["state"] in us_states

        if is_good:
            df.to_csv(
                os.path.join("data", "preprocessed", "business.csv"),
                index=False,
                header=not good_created,
                mode="a" if good_created else "w",
            )
            good_created = True
        
        else:
            df.to_csv(
                os.path.join("data", "preprocessed", "business_bad.csv"),
                index=False,
                header=not bad_created,
                mode="a" if bad_created else "w",
            )
            bad_created = True

create_business()
