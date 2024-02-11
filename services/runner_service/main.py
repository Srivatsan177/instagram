from datetime import datetime, timedelta

from airflow.models.dag import DAG

from airflow.operators.bash import BashOperator

with DAG(
    "tutorial_sri",
    default_args = {
        "depends_on_past": False,
        "email": ["airflow@example.com"],
        "email_on_failure": False,
        "email_on_retry": False,
        "retries": 1,
        "retry_delay": timedelta(minutes=5),
    },
    description="A Simple Tutorial",
    schedule=timedelta(minutes=1),
    start_date=datetime.utcnow(),
    catchup=False,
    tags=["sri_example"]
) as dag:
    t1 = BashOperator(
        task_id="print_date",
        bash_command="date",
    )
    t2 = BashOperator(
        task_id="sleep",
        bash_command="sleep 5",
        retries=3
    )

    t1 >> t2