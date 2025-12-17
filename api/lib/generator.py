import random
import string


def generate_random_code(length: int = 6):
    code = "".join(random.choice(string.digits) for _ in range(length))
    return code
