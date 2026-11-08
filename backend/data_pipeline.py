import pandas as pd
import os

def load_backend_data(data_dir="data"):
    """Loads all core CSV files from the project root data directory."""
    clients = pd.read_csv(os.path.join(data_dir, "clients.csv"))
    accounts = pd.read_csv(os.path.join(data_dir, "accounts.csv"))
    cards = pd.read_csv(os.path.join(data_dir, "cards.csv"))
    monthly_summary = pd.read_csv(os.path.join(data_dir, "monthly_summary.csv"))
    
    return clients, accounts, cards, monthly_summary

def find_id_column(df, possible_names):
    """Finds the correct ID column regardless of casing or formatting."""
    for col in possible_names:
        if col in df.columns:
            return col
    for col in df.columns:
        if 'id' in col.lower():
            return col
    raise KeyError(f"Could not find any ID column in {list(df.columns)}. Expected one of {possible_names}")

def build_profiles():
    """Merges datasets into unified client and account profiles dynamically."""
    clients, accounts, cards, monthly_summary = load_backend_data()
    
    client_pk = find_id_column(clients, ["client_id", "id", "clientID", "Client_ID"])
    account_client_fk = find_id_column(accounts, ["client_id", "id", "clientID", "Client_ID", "account_id"])
    
    if client_pk != "client_id":
        clients = clients.rename(columns={client_pk: "client_id"})
    if account_client_fk != "client_id":
        accounts = accounts.rename(columns={account_client_fk: "client_id"})
        
    df = pd.merge(accounts, clients, on="client_id", how="left")
    
    if not cards.empty:
        card_fk = find_id_column(cards, ["client_id", "account_id", "id"])
        if card_fk != "client_id":
            cards = cards.rename(columns={card_fk: "client_id"})
        df = pd.merge(df, cards, on="client_id", how="left", suffixes=('', '_card'))
        
    if not monthly_summary.empty:
        summary_fk = find_id_column(monthly_summary, ["client_id", "account_id", "id"])
        if summary_fk != "client_id":
            monthly_summary = monthly_summary.rename(columns={summary_fk: "client_id"})
        df = pd.merge(df, monthly_summary, on="client_id", how="left", suffixes=('', '_summary'))
        
    return df

if __name__ == "__main__":
    profiles_df = build_profiles()
    print(f"Successfully generated profile dataset with {len(profiles_df)} rows.")
    
    output_path = os.path.join("data", "processed_profiles.csv")
    profiles_df.to_csv(output_path, index=False)
    print(f"Saved processed profiles to {output_path}")