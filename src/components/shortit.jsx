import React, { useState } from "react";
import { TextField, Button, Grid, Card, CardContent, Typography } from "@mui/material";

const API_BASE = "http://localhost:4000";

export default function ShortenerForm() {
  const [rows, setRows] = useState([{ url: "", validity: "", alias: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (i, field, value) => {
    const newRows = [...rows];
    newRows[i][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    if (rows.length < 5) setRows([...rows, { url: "", validity: "", alias: "" }]);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shorten = async () => {
    const payloads = rows.filter(r => r.url).map(r => ({
      url: r.url,
      validity: r.validity ? parseInt(r.validity) : undefined,
      alias: r.alias || undefined
    }));

    const responses = await Promise.all(payloads.map(async (p) => {
      try {
        const res = await fetch(`${API_BASE}/api/shorten`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (err) {
        return { error: err.message };
      }
    }));

    setResults(responses);
  };

  return (
    <div>
      {rows.map((row, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Long URL" value={row.url}
                  onChange={(e) => handleChange(i, "url", e.target.value)} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Validity (minutes)" type="number" value={row.validity}
                  onChange={(e) => handleChange(i, "validity", e.target.value)} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Custom Shortcode" value={row.alias}
                  onChange={(e) => handleChange(i, "alias", e.target.value)} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addRow} disabled={rows.length >= 5}>+ Add url if any</Button>
      <Button variant="contained" color="primary" onClick={shorten} style={{ marginLeft: 12 }}>Shorten</Button>

      <div style={{ marginTop: 20 }}>
        {results.map((r, i) => (
          <Typography key={i} color={r.error ? "error" : "primary"}>
            {r.error ? r.error : r.short}
          </Typography>
        ))}
      </div>
    </div>
  );
}
