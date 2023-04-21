import pandas as pd
import os
import json
import tqdm


SMOKE = False


def get_raw_data():
    if SMOKE:
        path = os.path.join("data", "raw", "yelp_dataset", "user.json")
    else:
        path = os.path.join("data", "raw", "yelp_dataset", "yelp_academic_dataset_user.json")

    total_lines = 1_987_897

    with open(path, "r", encoding="utf-8") as f:
        for line in tqdm.tqdm(f, total=total_lines):
            obj = json.loads(line)
            yield obj


def create_neo4j():
    valid_users = set(
        pd.read_csv(
            os.path.join(
                "data",
                "preprocessed",
                "user.csv",
            )
        )["user_id"].to_list()
    )

    with open(
        os.path.join(
            "data",
            "preprocessed",
            "neo4j",
            "users.csv",
        ),
        "w",
        encoding="utf-8",
    ) as f_user, open(
        os.path.join(
            "data",
            "preprocessed",
            "neo4j",
            "friendship.csv",
        ),
        "w",
        encoding="utf-8",
    ) as f_fri:
        f_user.write("user_id:ID\n")
        f_fri.write(":START_ID,:END_ID\n")

        for obj in get_raw_data():
            user_id = obj["user_id"]
            f_user.write(f"{user_id}\n")

            for friend_id_raw in obj["friends"].split(","):
                friend_id = friend_id_raw.strip()
                if user_id > friend_id and friend_id in valid_users:
                    f_fri.write(f"{user_id},{friend_id}\n")


if __name__ == "__main__":
    create_neo4j()
