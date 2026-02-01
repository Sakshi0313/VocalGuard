import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

# 🔸 Replace this path with the actual dataset path you used for training
df = pd.read_csv(r"C:\Users\shrut\Downloads\archive\KAGGLE\DATASET-balanced.csv")

# 🔸 Drop label column if it exists
if "LABEL" in df.columns:
    X = df.drop("LABEL", axis=1).values
else:
    X = df.values

# Fit the scaler
scaler = StandardScaler()
scaler.fit(X)

# Save in your current environment
joblib.dump(scaler, "scaler.pkl")
print("✅ scaler.pkl created successfully in this environment")
