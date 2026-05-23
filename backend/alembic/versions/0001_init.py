from alembic import op
import sqlalchemy as sa
revision='0001_init'; down_revision=None; branch_labels=None; depends_on=None

def upgrade():
    op.create_table('lead_events', sa.Column('id', sa.Integer(), primary_key=True), sa.Column('entity', sa.String(128), nullable=False), sa.Column('event_type', sa.String(128), nullable=False), sa.Column('city', sa.String(128), nullable=False), sa.Column('sentiment_growth', sa.Float(), nullable=False), sa.Column('impact_score', sa.Float(), nullable=False))

def downgrade():
    op.drop_table('lead_events')
