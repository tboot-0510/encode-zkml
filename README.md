# Loan Approval without Exposing Financial Data with EZKL

This project has been created during the zkML Bootcamp https://www.encode.club/zkml-bootcamp 

The implementation uses zero-knowledge proofs to allow users to receive loan predictions without revealing their sensitive data.

A borrower applies for a loan and wants to prove they are creditworthy without revealing their financial data. A random forest model predicts whether the loan is approved or not, and the correctness of the computation—along with the model’s output—is sent to the smart contract, which verifies it.

The solution uses:
- Frontend: A web form for user data entry and input normalization 
- Backend proof generation: To generate the proof and predict the model
- Smart Contract: For proof verification
- Model preparation: Done in Python using EZKL

Architecture Miro:
https://miro.com/app/board/uXjVIPbjYEM=/?share_link_id=623006867890

## Model Preparation

The model is based on this Dataset: https://www.kaggle.com/datasets/burak3ergun/loan-data-set found in Kaggle

You can follow this notebook to create the required files for EZKL (settings.json, network.compiled, pk.key, kzg14.srs and network.onnx)

https://github.com/tboot-0510/encode-zkml/blob/main/Loan_Prediction_and_EZKL.ipynb

## Frontend and Backend API

https://github.com/tboot-0510/encode-zkml/tree/main/app

## Smart Contract 

https://github.com/tboot-0510/encode-zkml/tree/main/contracts

## Setup

python3 -m venv venv

source venv/bin/activate

pip install requirements.txt

python3 main.py


## Generate the pk.key

yarn setup
