import pandas as pd
from typing import Iterable
import os
import tqdm
import json
import datetime
import hashlib
import string
import random
import numpy as np
import uuid

SMOKE = False


def get_raw_data(name: str) -> Iterable[object]:
    if name != "photo":
        if SMOKE:
            path = os.path.join("data", "raw", "yelp_dataset", f"{name}.json")
        else:
            path = os.path.join("data", "raw", "yelp_dataset", f"yelp_academic_dataset_{name}.json")
    else:
        if SMOKE:
            path = os.path.join("data", "raw", "yelp_photos", "photos_smoke.json")
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

    with open(
        os.path.join("data", "preprocessed", "business.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as good_f, open(
        os.path.join("data", "preprocessed", "business_bad.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as bad_f:
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
                    good_f,
                    index=False,
                    header=not good_created,
                )
                good_created = True

            else:
                df.to_csv(
                    bad_f,
                    index=False,
                    header=not bad_created,
                )
                bad_created = True


def get_good_business_ids():
    return pd.read_csv(os.path.join("data", "preprocessed", "business.csv"))["business_id"].tolist()


def get_bad_business_ids():
    return pd.read_csv(os.path.join("data", "preprocessed", "business_bad.csv"))["business_id"].tolist()


def create_business_categories():
    created = False

    with open(
        os.path.join("data", "preprocessed", "business_categories.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as f:
        for obj in get_raw_data("business"):
            business_id = obj["business_id"]

            bad_business_ids = set(get_bad_business_ids())

            if business_id not in bad_business_ids and obj.get("categories", ""):
                raw_categories = obj["categories"]
                categories = [c.strip() for c in raw_categories.split(",")]
                df = pd.DataFrame(
                    {"business_id": [business_id for _ in range(len(categories))], "category": categories}
                )

                df.to_csv(
                    f,
                    index=False,
                    header=not created,
                )
                created = True


def random_string(length):
    letters = string.ascii_lowercase
    return "".join(random.choice(letters) for _ in range(length))


def create_user():
    good_created = False
    bad_created = False

    with open(
        os.path.join("data", "preprocessed", "user.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as good_f, open(
        os.path.join("data", "preprocessed", "user_bad.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as bad_f:
        for obj in get_raw_data("user"):
            result_obj = {k: obj.get(k, None) for k in ["user_id", "name"]}
            salt = random_string(10)
            password = random_string(6)

            result_obj["salt"] = salt
            result_obj["salted_hashed_password"] = hashlib.sha256((salt + password).encode()).hexdigest()

            try:
                result_obj["yelp_since"] = datetime.datetime.strptime(obj["yelping_since"], r"%Y-%m-%d %H:%M:%S")
            except:
                result_obj["yelp_since"] = None

            df = pd.DataFrame([result_obj])

            is_good = df.notnull().all().all()

            if is_good:
                df.to_csv(
                    good_f,
                    index=False,
                    header=not good_created,
                )
                good_created = True

            else:
                df.to_csv(
                    bad_f,
                    index=False,
                    header=not bad_created,
                )
                bad_created = True


def get_good_user_ids():
    return pd.read_csv(os.path.join("data", "preprocessed", "user.csv"))["user_id"].tolist()


def get_bad_user_ids():
    try:  # So far it seems that no user id has problem
        return pd.read_csv(os.path.join("data", "preprocessed", "user_bad.csv"))["user_id"].tolist()
    except:
        return []


def create_review():
    good_created = False
    bad_created = False

    bad_business_ids = set(get_bad_business_ids())
    bad_user_ids = set(get_bad_user_ids())

    with open(
        os.path.join("data", "preprocessed", "review.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as good_f, open(
        os.path.join("data", "preprocessed", "review_bad.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as bad_f:
        for obj in get_raw_data("review"):
            result_obj = {k: obj.get(k, None) for k in ["review_id", "user_id", "business_id", "stars"]}

            try:
                result_obj["date"] = datetime.datetime.strptime(obj["date"], r"%Y-%m-%d %H:%M:%S").date()
            except:
                result_obj["date"] = None

            result_obj["text"] = obj["text"][:1000]

            df = pd.DataFrame([result_obj]).astype({"stars": int})

            is_good = (
                df.notnull().all().all()
                and result_obj["business_id"] not in bad_business_ids
                and result_obj["user_id"] not in bad_user_ids
            )

            if is_good:
                df.to_csv(
                    good_f,
                    index=False,
                    header=not good_created,
                )
                good_created = True

            else:
                df.to_csv(
                    bad_f,
                    index=False,
                    header=not bad_created,
                )
                bad_created = True


def get_good_review_ids():
    return pd.read_csv(os.path.join("data", "preprocessed", "review.csv"))["review_id"].tolist()


def get_bad_review_ids():
    return pd.read_csv(os.path.join("data", "preprocessed", "review_bad.csv"))["review_id"].tolist()


def create_review_attitude():
    user_ids = get_good_user_ids()
    bad_review_ids = set(get_bad_review_ids())

    created = False

    with open(
        os.path.join("data", "preprocessed", "review_attitude.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as f:
        for obj in get_raw_data("review"):
            review_id = obj["review_id"]
            if review_id not in bad_review_ids:
                for attitude in ["useful", "funny", "cool"]:
                    cnt = obj[attitude]
                    if cnt > 0:
                        selected_ids = random.sample(user_ids, k=cnt)

                        df = pd.DataFrame(
                            {
                                "review_id": [review_id] * cnt,
                                "attitude_user_id": selected_ids,
                                "attitude_type": [attitude] * cnt,
                            }
                        )

                        df.to_csv(
                            f,
                            index=False,
                            header=not created,
                        )
                        created = True


def create_tip():
    good_created = False
    bad_created = False

    with open(
        os.path.join("data", "preprocessed", "tip.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as good_f, open(
        os.path.join("data", "preprocessed", "tip_bad.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as bad_f:
        for obj in get_raw_data("tip"):
            result_obj = {"tip_id": str(uuid.uuid4())}

            for k in ["user_id", "business_id"]:
                result_obj[k] = obj.get(k, None)

            result_obj["text"] = obj["text"][:200]

            try:
                result_obj["date"] = datetime.datetime.strptime(obj["date"], r"%Y-%m-%d %H:%M:%S").date()
            except:
                result_obj["date"] = None

            df = pd.DataFrame([result_obj])

            bad_business_ids = set(get_bad_business_ids())
            bad_user_ids = set(get_bad_user_ids())

            is_good = (
                df.notnull().all().all()
                and result_obj["business_id"] not in bad_business_ids
                and result_obj["user_id"] not in bad_user_ids
            )

            if is_good:
                df.to_csv(
                    good_f,
                    index=False,
                    header=not good_created,
                )
                good_created = True

            else:
                df.to_csv(
                    bad_f,
                    index=False,
                    header=not bad_created,
                )
                bad_created = True


def create_photo():
    good_created = False
    bad_created = False

    with open(
        os.path.join("data", "preprocessed", "photo.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as good_f, open(
        os.path.join("data", "preprocessed", "photo_bad.csv"),
        "w",
        encoding="utf-8",
        newline="\n",
    ) as bad_f:
        for obj in get_raw_data("photo"):
            result_obj = {k: obj.get(k, None) for k in ["photo_id", "business_id", "caption", "label"]}

            df = pd.DataFrame([result_obj])

            bad_business_ids = set(get_bad_business_ids())

            is_good = df.notnull().all().all() and result_obj["business_id"] not in bad_business_ids

            if is_good:
                df.to_csv(
                    good_f,
                    index=False,
                    header=not good_created,
                )
                good_created = True

            else:
                df.to_csv(
                    bad_f,
                    index=False,
                    header=not bad_created,
                )
                bad_created = True


if __name__ == "__main__":
    # create_business()
    # create_business_categories()
    # create_user()
    # create_review()
    create_review_attitude()
    # create_tip()
    # create_photo()
