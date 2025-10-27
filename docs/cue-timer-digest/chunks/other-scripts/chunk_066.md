# Chunk 66: other_scripts

## Metadata

- **Files**: 1
- **Size**: 8,587 characters (~2,146 tokens)
- **Categories**: other

## Files in this chunk

- `scripts/keyword_analysis.py`

---

## File: `scripts/keyword_analysis.py`

```python
#!/usr/bin/env python3
import json
import os
import pandas as pd
import numpy as np
from collections import defaultdict
import re

def parse_search_volume(volume_text):
    """Parse search volume text to numeric values"""
    if pd.isna(volume_text) or volume_text == '—':
        return 0, 0

    # Handle range values like "10 – 100", "1 mil – 10 mil", etc.
    if '–' in str(volume_text):
        parts = str(volume_text).split('–')
        try:
            # Remove non-numeric characters and convert
            min_val = re.sub(r'[^\d]', '', parts[0].strip())
            max_val = re.sub(r'[^\d]', '', parts[1].strip())

            # Handle different magnitude scales
            def convert_value(val):
                if 'mil' in parts[1]:
                    return float(val) * 1000000
                elif 'mi' in parts[1]:
                    return float(val) * 1000000
                else:
                    return float(val)

            min_num = convert_value(min_val)
            max_num = convert_value(max_val)
            return min_num, max_num
        except:
            return 0, 0

    # Handle single values like "0 – 10", "100 – 1 mil"
    try:
        if 'mil' in str(volume_text):
            parts = str(volume_text).split(' ')
            return 0, float(parts[0]) * 1000000
        elif 'mi' in str(volume_text):
            parts = str(volume_text).split(' ')
            return 0, float(parts[0]) * 1000000
        else:
            parts = str(volume_text).split(' ')
            return 0, float(parts[0])
    except:
        return 0, 0

def parse_cpc(cpc_text):
    """Parse CPC text to numeric value"""
    if pd.isna(cpc_text) or cpc_text == '—':
        return 0.0

    try:
        # Remove currency symbols and convert
        clean_value = re.sub(r'[^\d.,]', '', str(cpc_text))
        # Replace comma with dot for decimal
        clean_value = clean_value.replace(',', '.')
        return float(clean_value)
    except:
        return 0.0

def categorize_competition(comp_text):
    """Categorize competition level"""
    if pd.isna(comp_text) or comp_text == '—':
        return 'Unknown'
    comp = str(comp_text).lower()
    if comp == 'baixa':
        return 'Low'
    elif comp == 'média':
        return 'Medium'
    elif comp == 'alta':
        return 'High'
    return comp

def load_keyword_data(directory):
    """Load all keyword data from JSON and MD files"""
    all_data = []

    # Load JSON files
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    all_data.extend(data)
            except Exception as e:
                print(f"Error loading {filename}: {e}")

    return all_data

def analyze_keywords_for_target_markets(data):
    """Analyze keywords specifically for CueTimer's target markets"""

    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Clean and process data
    df['min_volume'] = df['value-text'].apply(lambda x: parse_search_volume(x)[0])
    df['max_volume'] = df['value-text'].apply(lambda x: parse_search_volume(x)[1])
    df['avg_volume'] = (df['min_volume'] + df['max_volume']) / 2

    df['cpc_low'] = df['data-numeric (4)'].apply(parse_cpc)
    df['cpc_high'] = df['data-numeric (5)'].apply(parse_cpc)
    df['avg_cpc'] = (df['cpc_low'] + df['cpc_high']) / 2

    df['competition'] = df['resizable'].apply(categorize_competition)

    # Target market keyword patterns
    worship_patterns = [
        r'church|worship|service|sermon|ministry|religious|prayer|gospel|choir',
        r'stage|pulpit|sanctuary|altar'
    ]

    corporate_patterns = [
        r'corporate|conference|business|meeting|presentation|professional|executive',
        r'team|office|workplace|boardroom|company|organization'
    ]

    speaker_patterns = [
        r'speaker|presentation|talk|keynote|speech|presenter|public speaking',
        r'ted|conference speaker|motivational|trainer|coach'
    ]

    event_patterns = [
        r'event|wedding|party|celebration|ceremony|gathering|occasion',
        r'countdown|timer|schedule|agenda|program'
    ]

    professional_patterns = [
        r'professional|business|work|productivity|focus|time management',
        r'desktop|mobile|app|software|tool|utility'
    ]

    # Categorize keywords
    def categorize_keyword(keyword):
        keyword_lower = keyword.lower()

        if any(re.search(pattern, keyword_lower) for pattern in worship_patterns):
            return 'Worship Services'
        elif any(re.search(pattern, keyword_lower) for pattern in corporate_patterns):
            return 'Corporate Events'
        elif any(re.search(pattern, keyword_lower) for pattern in speaker_patterns):
            return 'Professional Speakers'
        elif any(re.search(pattern, keyword_lower) for pattern in event_patterns):
            return 'General Events'
        elif any(re.search(pattern, keyword_lower) for pattern in professional_patterns):
            return 'Professional Tools'
        else:
            return 'Other'

    df['category'] = df['keyword'].apply(categorize_keyword)

    # Calculate opportunity score
    df['opportunity_score'] = (
        np.log1p(df['avg_volume']) * 0.4 +  # Search volume (log scale)
        (1 / (df['avg_cpc'] + 0.01)) * 0.3 +  # Lower CPC = higher opportunity
        (df['competition'].map({'Low': 3, 'Medium': 2, 'High': 1, 'Unknown': 1.5})) * 0.3  # Lower competition = higher opportunity
    )

    return df

def generate_recommendations(df):
    """Generate specific keyword recommendations for CueTimer"""

    recommendations = {
        'high_opportunity': [],
        'low_competition': [],
        'high_volume': [],
        'by_category': defaultdict(list),
        'gaps_opportunities': []
    }

    # Filter relevant keywords (exclude very low volume)
    relevant_df = df[df['avg_volume'] >= 10].copy()

    # High opportunity keywords (good volume, reasonable CPC, lower competition)
    high_opp = relevant_df[
        (relevant_df['avg_volume'] >= 100) &
        (relevant_df['avg_cpc'] <= 5.0) &
        (relevant_df['competition'].isin(['Low', 'Medium']))
    ].sort_values('opportunity_score', ascending=False).head(20)

    # Low competition keywords
    low_comp = relevant_df[
        (relevant_df['competition'] == 'Low') &
        (relevant_df['avg_volume'] >= 50)
    ].sort_values('avg_volume', ascending=False).head(20)

    # High volume keywords
    high_vol = relevant_df[
        (relevant_df['avg_volume'] >= 10000)
    ].sort_values('avg_volume', ascending=False).head(20)

    recommendations['high_opportunity'] = high_opp[['keyword', 'category', 'avg_volume', 'avg_cpc', 'competition', 'opportunity_score']].to_dict('records')
    recommendations['low_competition'] = low_comp[['keyword', 'category', 'avg_volume', 'avg_cpc', 'competition']].to_dict('records')
    recommendations['high_volume'] = high_vol[['keyword', 'category', 'avg_volume', 'avg_cpc', 'competition']].to_dict('records')

    # Group by category
    for category in relevant_df['category'].unique():
        if category != 'Other':
            cat_df = relevant_df[relevant_df['category'] == category]
            top_keywords = cat_df.sort_values('opportunity_score', ascending=False).head(10)
            recommendations['by_category'][category] = top_keywords[['keyword', 'avg_volume', 'avg_cpc', 'competition', 'opportunity_score']].to_dict('records')

    # Identify gaps (keywords that should exist but don't)
    potential_gaps = [
        'stage timer app for church',
        'worship service countdown timer',
        'sermon timer mobile app',
        'church presentation timer',
        'corporate event timer app',
        'business meeting timer mobile',
        'professional speaker timer tool',
        'keynote presentation timer app',
        'mobile stage timer for events',
        'conference session timer app'
    ]

    recommendations['gaps_opportunities'] = potential_gaps

    return recommendations

def main():
    # Load data
    data_directory = '/home/carlos/projects/cue-timer/docs/research/market-analysis'
    keyword_data = load_keyword_data(data_directory)

    # Analyze for target markets
    df = analyze_keywords_for_target_markets(keyword_data)

    # Generate recommendations
    recommendations = generate_recommendations(df)

    return df, recommendations

if __name__ == '__main__':
    df, recommendations = main()
```
