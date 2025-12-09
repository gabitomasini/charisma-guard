# Guia de Conexão ao Banco de Dados de Produção

Este guia descreve os parâmetros necessários para conectar uma aplicação externa (Agente) ao banco de dados PostgreSQL de produção.

## 1. Credenciais de Acesso

Configure as seguintes variáveis de ambiente ou parâmetros na sua aplicação externa:

| Parâmetro | Valor | Notas |
| :--- | :--- | :--- |
| **Host** | `clippingdb.csyipmi0rbox.us-east-1.rds.amazonaws.com` | Endereço do servidor AWS RDS |
| **Porta** | `5432` | Porta padrão do PostgreSQL |
| **Banco de Dados** | `clippingdb` | Nome do banco |
| **Usuário** | `postgres` | Usuário principal |
| **Senha** | `[INSIRA_A_SENHA_AQUI]` | **Ação Necessária**: Obtenha a senha com a equipe DevOps |

## 2. Configuração Crítica: Schema

O banco de dados utiliza schemas separados para organizar os dados. Para acessar os dados de produção corretos, você **DEVE** configurar o `search_path`.

### Opção A: Configuração na String de Conexão (Recomendado)
Se sua biblioteca de banco de dados permitir passar opções na URL ou parâmetros de conexão, adicione:

*   **Parâmetro**: `options`
*   **Valor**: `-c search_path=clippingdb,news_charisma`

**Exemplo de URL (Python/SQLAlchemy/Django):**
```text
postgresql://postgres:[SENHA]@clippingdb.csyipmi0rbox.us-east-1.rds.amazonaws.com:5432/clippingdb?options=-c%20search_path%3Dclippingdb,news_charisma
```

### Opção B: Comando SQL Pós-Conexão
Se não for possível configurar na conexão, execute este comando SQL imediatamente após conectar e **antes** de fazer qualquer consulta:

```sql
SET search_path TO clippingdb, news_charisma;
```

> **Por que isso é importante?**
> Se você não definir o `search_path`, sua aplicação pode não encontrar as tabelas ou, pior, acessar tabelas vazias/de teste no schema `public`. O schema de produção é `news_charisma`.

## 3. Resumo para Desenvolvedor (Snippet Python)

Se o seu agente for em Python, aqui está um exemplo pronto para uso:

```python
import psycopg2
import os

# Passo 1: Defina a senha (idealmente via variável de ambiente)
DB_PASSWORD = os.getenv("DB_PASSWORD", "SuaSenhaAqui")

try:
    # Passo 2: Conectar
    connection = psycopg2.connect(
        host="clippingdb.csyipmi0rbox.us-east-1.rds.amazonaws.com",
        port="5432",
        database="clippingdb",
        user="postgres",
        password=DB_PASSWORD,
        # Passo 3: Forçar o schema correto
        options="-c search_path=clippingdb,news_charisma"
    )
    
    print("Conexão bem-sucedida ao ambiente de PRODUÇÃO!")
    
    # Exemplo: Listar tabelas para confirmar
    cursor = connection.cursor()
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'news_charisma';")
    tables = cursor.fetchall()
    print(f"Tabelas encontradas: {len(tables)}")

except Exception as e:
    print(f"Erro ao conectar: {e}")
```

---
**Próximos Passos:**
1.  Obtenha a senha de produção.
2.  Cole a senha no local indicado.
3.  Utilize as configurações acima no seu agente.
